<?php
/**
 * Study Notes & Document AI Summarizer API
 * Actions: list, save, delete, summarize, extract_exam_questions
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/AIService.php';

$userId = Auth::requireAuth();
$pdo = Database::getConnection();

// Ensure study_notes table exists in database
$pdo->exec("CREATE TABLE IF NOT EXISTS study_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    subject TEXT DEFAULT 'General',
    content TEXT NOT NULL,
    summary TEXT,
    tags TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)");

$action = $_GET['action'] ?? $_POST['action'] ?? 'list';
$input = json_decode(file_get_contents('php://input'), true) ?? [];
if (!empty($input['action'])) {
    $action = $input['action'];
}

switch ($action) {
    case 'list':
        $q = trim($_GET['q'] ?? $input['q'] ?? '');
        if (!empty($q)) {
            $stmt = $pdo->prepare("SELECT * FROM study_notes WHERE user_id = ? AND (title LIKE ? OR content LIKE ? OR subject LIKE ? OR tags LIKE ?) ORDER BY updated_at DESC");
            $term = "%{$q}%";
            $stmt->execute([$userId, $term, $term, $term, $term]);
        } else {
            $stmt = $pdo->prepare("SELECT * FROM study_notes WHERE user_id = ? ORDER BY updated_at DESC");
            $stmt->execute([$userId]);
        }
        $notes = $stmt->fetchAll();
        echo json_encode(['success' => true, 'notes' => $notes], JSON_UNESCAPED_UNICODE);
        break;

    case 'save':
        $id = (int)($input['id'] ?? 0);
        $title = trim($input['title'] ?? 'Untitled Note');
        $subject = trim($input['subject'] ?? 'General');
        $content = trim($input['content'] ?? '');
        $tags = trim($input['tags'] ?? '');
        $summary = isset($input['summary']) ? trim($input['summary']) : null;

        if (empty($content) && empty($title)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Note content cannot be empty']);
            exit;
        }

        if ($id > 0) {
            $stmt = $pdo->prepare("UPDATE study_notes SET title = ?, subject = ?, content = ?, summary = COALESCE(?, summary), tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?");
            $stmt->execute([$title, $subject, $content, $summary, $tags, $id, $userId]);
            $savedId = $id;
        } else {
            $stmt = $pdo->prepare("INSERT INTO study_notes (user_id, title, subject, content, summary, tags) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$userId, $title, $subject, $content, $summary, $tags]);
            $savedId = (int)$pdo->lastInsertId();
        }

        echo json_encode(['success' => true, 'id' => $savedId, 'message' => 'Note saved successfully']);
        break;

    case 'delete':
        $id = (int)($_GET['id'] ?? $input['id'] ?? 0);
        $stmt = $pdo->prepare("DELETE FROM study_notes WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);
        echo json_encode(['success' => true, 'message' => 'Note deleted successfully']);
        break;

    case 'summarize':
    case 'extract_exam_questions':
        $content = trim($input['content'] ?? $_POST['content'] ?? '');
        $lang = trim($input['lang'] ?? 'en');
        $noteId = (int)($input['note_id'] ?? 0);
        $length = trim($input['length'] ?? 'medium'); // short, medium, detailed
        $format = trim($input['format'] ?? ($action === 'extract_exam_questions' ? 'exam_points' : 'structured')); // bullet, structured, exam_points, simple

        if (empty($content)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'No notes or document content provided for processing']);
            exit;
        }

        // Retrieve user learning memories for tailored summary
        $memStmt = $pdo->prepare("SELECT category, title, content FROM personal_memories WHERE user_id = ? AND is_active = 1");
        $memStmt->execute([$userId]);
        $memories = $memStmt->fetchAll();

        $lengthInstruction = match($length) {
            'short' => "Keep the response concise (under 150 words), focusing on core definitions and the top 3 takeaways.",
            'detailed' => "Provide a thorough and comprehensive academic breakdown covering all concepts, definitions, mechanisms, and examples.",
            default => "Provide a balanced, high-yield academic summary (around 250-350 words)."
        };

        $formatInstruction = match($format) {
            'bullet' => "Format strictly as scannable bullet points with bold keywords.",
            'exam_points' => "Generate 4 to 6 high-yield university exam questions (with 2-mark conceptual questions and 8-mark descriptive questions) followed by bulleted model answers.",
            'simple' => "Explain the concepts using simple everyday analogies, followed by a beginner-friendly breakdown.",
            default => "Organize into: 1. Main Topic & Overview, 2. Key Definitions & Concepts, 3. Core Mechanisms, 4. Concrete Examples, 5. Exam Quick Review."
        };

        $langInstruction = ($lang === 'ta')
            ? "Respond in clear, accurate Tamil (தமிழ்) with English technical terms preserved in parentheses."
            : "Respond in clear, structured English with markdown headings and code/bullet blocks.";

        $prompt = <<<PROMPT
Act as an expert university professor and study guide creator. Process the following student study material.

=== USER-SPECIFIED REQUIREMENTS ===
- Target Format: {$formatInstruction}
- Target Depth: {$lengthInstruction}
- Language: {$langInstruction}

=== STUDY MATERIAL / LECTURE CONTENT ===
{$content}

INSTRUCTIONS:
1. Base the summary strictly on the actual material provided above. Do not invent unrelated topics.
2. Structure the output clearly using markdown headings, lists, and formatted code/math if applicable.
PROMPT;

        $customKey = $input['api_key'] ?? null;
        $customUrl = $input['api_url'] ?? null;
        $customModel = $input['model'] ?? null;

        $aiService = new AIService();
        $res = $aiService->generateResponse($prompt, $memories, $lang, 'Summary', $customKey, $customUrl, $customModel);

        // If note_id was passed, save the generated summary to the note record
        if ($noteId > 0 && !empty($res['message'])) {
            $stmt = $pdo->prepare("UPDATE study_notes SET summary = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?");
            $stmt->execute([$res['message'], $noteId, $userId]);
        }

        echo json_encode([
            'success' => true,
            'result' => $res['message'],
            'is_live_ai' => $res['is_live_ai'] ?? false,
            'provider' => $res['provider'] ?? 'grounded_engine',
            'notice' => $res['notice'] ?? null
        ], JSON_UNESCAPED_UNICODE);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unknown notes action']);
        break;
}
