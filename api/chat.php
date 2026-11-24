<?php
/**
 * Unified AI Chatbot API Endpoint
 * Handles live AI communication, personal context injection, conversation history, and clear availability notices
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/AIService.php';

$userId = Auth::requireAuth();
$pdo = Database::getConnection();

$action = $_GET['action'] ?? $_POST['action'] ?? 'send';
$input = json_decode(file_get_contents('php://input'), true) ?? [];
if (!empty($input['action'])) {
    $action = $input['action'];
}

switch ($action) {
    case 'history':
        // Retrieve recent messages for the active conversation
        $convId = (int)($_GET['conversation_id'] ?? 1);
        $stmt = $pdo->prepare("SELECT id, sender_type, message_text, context_retrieved, reasoning_meta, created_at FROM chat_messages WHERE user_id = ? AND conversation_id = ? ORDER BY id ASC LIMIT 50");
        $stmt->execute([$userId, $convId]);
        $messages = $stmt->fetchAll();
        echo json_encode(['success' => true, 'messages' => $messages], JSON_UNESCAPED_UNICODE);
        break;

    case 'clear':
        $convId = (int)($input['conversation_id'] ?? $_POST['conversation_id'] ?? 1);
        $stmt = $pdo->prepare("DELETE FROM chat_messages WHERE user_id = ? AND conversation_id = ?");
        $stmt->execute([$userId, $convId]);
        echo json_encode(['success' => true, 'message' => 'Conversation history cleared']);
        break;

    case 'send':
    default:
        $userMessage = trim($input['message'] ?? $_POST['message'] ?? '');
        $convId = (int)($input['conversation_id'] ?? 1);
        $lang = trim($input['lang'] ?? 'en');
        $intent = trim($input['intent'] ?? 'General');

        if (empty($userMessage)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Message text cannot be empty']);
            exit;
        }

        // 1. Fetch recent conversation history (last 6 messages) for multi-turn conversational context
        $histStmt = $pdo->prepare("SELECT sender_type, message_text FROM chat_messages WHERE user_id = ? AND conversation_id = ? ORDER BY id DESC LIMIT 6");
        $histStmt->execute([$userId, $convId]);
        $recentHistory = array_reverse($histStmt->fetchAll());

        // 2. Save user message to database
        $userMsgStmt = $pdo->prepare("INSERT INTO chat_messages (conversation_id, user_id, sender_type, message_text) VALUES (?, ?, 'user', ?)");
        $userMsgStmt->execute([$convId, $userId, $userMessage]);

        // 3. Retrieve relevant personal memories for query
        $memStmt = $pdo->prepare("SELECT category, title, content, is_confirmed_fact FROM personal_memories WHERE user_id = ? AND is_active = 1");
        $memStmt->execute([$userId]);
        $allMemories = $memStmt->fetchAll();

        // Keyword matching for relevant context
        $relevantMemories = [];
        $words = preg_split('/\s+/', mb_strtolower($userMessage, 'UTF-8'));
        foreach ($allMemories as $m) {
            $text = mb_strtolower($m['title'] . ' ' . $m['content'], 'UTF-8');
            foreach ($words as $w) {
                if (strlen($w) > 2 && str_contains($text, $w)) {
                    $relevantMemories[] = $m;
                    break;
                }
            }
        }
        if (empty($relevantMemories)) {
            // Provide key background memories by default if specific keywords didn't trigger
            $relevantMemories = array_slice($allMemories, 0, 3);
        }

        // 4. Call AI Service (Live LLM with multi-turn history)
        $customKey = $input['api_key'] ?? $_POST['api_key'] ?? null;
        if (!$customKey && !empty($_SERVER['HTTP_AUTHORIZATION'])) {
            if (preg_match('/Bearer\s+(.*)$/i', $_SERVER['HTTP_AUTHORIZATION'], $m)) {
                $customKey = trim($m[1]);
            }
        }
        $customUrl = $input['api_url'] ?? $_POST['api_url'] ?? null;
        $customModel = $input['model'] ?? $_POST['model'] ?? null;

        $aiService = new AIService();
        $aiResult = $aiService->generateResponse(
            $userMessage, 
            $relevantMemories, 
            $lang, 
            $intent, 
            $customKey, 
            $customUrl, 
            $customModel,
            $recentHistory
        );

        $aiReplyText = $aiResult['message'] ?? 'Could not generate response.';
        $retrievedSummary = implode("; ", array_map(fn($m) => $m['title'], $relevantMemories));
        $reasoningMeta = $aiResult['reasoning_meta'] ?? '';

        // 5. Save AI response to database
        $botMsgStmt = $pdo->prepare("INSERT INTO chat_messages (conversation_id, user_id, sender_type, message_text, context_retrieved, reasoning_meta) VALUES (?, ?, 'assistant', ?, ?, ?)");
        $botMsgStmt->execute([$convId, $userId, $aiReplyText, $retrievedSummary, $reasoningMeta]);
        $botMsgId = (int)$pdo->lastInsertId();

        echo json_encode([
            'success' => true,
            'message_id' => $botMsgId,
            'reply' => $aiReplyText,
            'is_live_ai' => $aiResult['is_live_ai'] ?? false,
            'provider' => $aiResult['provider'] ?? 'grounded',
            'model' => $aiResult['model'] ?? 'local',
            'notice' => $aiResult['notice'] ?? null,
            'context_retrieved' => $relevantMemories,
            'reasoning_meta' => $reasoningMeta
        ], JSON_UNESCAPED_UNICODE);
        break;
}
