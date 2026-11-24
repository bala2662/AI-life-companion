<?php
/**
 * In-Browser PDF & Document RAG Knowledge API
 * Actions: list, upload, get, delete, rag_query
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/AIService.php';

$userId = Auth::requireAuth();
$pdo = Database::getConnection();

// Ensure uploaded_documents table exists
$pdo->exec("CREATE TABLE IF NOT EXISTS uploaded_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    filename TEXT NOT NULL,
    file_type TEXT DEFAULT 'pdf',
    file_size INTEGER DEFAULT 0,
    page_count INTEGER DEFAULT 1,
    chunks_json TEXT NOT NULL,
    summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)");

$action = $_GET['action'] ?? $_POST['action'] ?? 'list';
$input = json_decode(file_get_contents('php://input'), true) ?? [];
if (!empty($input['action'])) {
    $action = $input['action'];
}

switch ($action) {
    case 'list':
        $stmt = $pdo->prepare("SELECT id, filename, file_type, file_size, page_count, summary, created_at FROM uploaded_documents WHERE user_id = ? ORDER BY id DESC");
        $stmt->execute([$userId]);
        $docs = $stmt->fetchAll();
        echo json_encode(['success' => true, 'documents' => $docs], JSON_UNESCAPED_UNICODE);
        break;

    case 'upload':
        $filename = trim($input['filename'] ?? $_POST['filename'] ?? 'Lecture_Notes.pdf');
        $fileType = trim($input['file_type'] ?? $_POST['file_type'] ?? 'pdf');
        $fileSize = (int)($input['file_size'] ?? $_POST['file_size'] ?? 0);
        $pageCount = (int)($input['page_count'] ?? $_POST['page_count'] ?? 1);
        $rawChunks = $input['chunks'] ?? [];
        $summary = trim($input['summary'] ?? '');

        if (empty($rawChunks)) {
            // If raw text was passed, split into meaningful chunks
            $rawText = trim($input['text'] ?? $_POST['text'] ?? '');
            if (empty($rawText)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'No readable document content or chunks provided']);
                exit;
            }
            $paragraphs = preg_split('/\n\s*\n/', $rawText);
            $rawChunks = [];
            foreach ($paragraphs as $idx => $para) {
                $trimmed = trim($para);
                if (strlen($trimmed) > 15) {
                    $rawChunks[] = [
                        'page' => (int)floor($idx / 3) + 1,
                        'text' => $trimmed
                    ];
                }
            }
        }

        $chunksJson = json_encode($rawChunks, JSON_UNESCAPED_UNICODE);

        $stmt = $pdo->prepare("INSERT INTO uploaded_documents (user_id, filename, file_type, file_size, page_count, chunks_json, summary) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $filename, $fileType, $fileSize, $pageCount, $chunksJson, $summary]);
        $docId = (int)$pdo->lastInsertId();

        echo json_encode([
            'success' => true,
            'message' => 'Document indexed successfully for RAG question answering',
            'document_id' => $docId,
            'chunks_count' => count($rawChunks)
        ]);
        break;

    case 'delete':
        $id = (int)($_GET['id'] ?? $input['id'] ?? 0);
        $stmt = $pdo->prepare("DELETE FROM uploaded_documents WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);
        echo json_encode(['success' => true, 'message' => 'Document deleted']);
        break;

    case 'rag_query':
        $query = trim($input['query'] ?? $_POST['query'] ?? '');
        $docId = (int)($input['doc_id'] ?? $_POST['doc_id'] ?? 0);
        $lang = trim($input['lang'] ?? 'en');

        if (empty($query)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Query cannot be empty']);
            exit;
        }

        // Fetch documents
        if ($docId > 0) {
            $stmt = $pdo->prepare("SELECT id, filename, chunks_json FROM uploaded_documents WHERE id = ? AND user_id = ?");
            $stmt->execute([$docId, $userId]);
        } else {
            $stmt = $pdo->prepare("SELECT id, filename, chunks_json FROM uploaded_documents WHERE user_id = ? ORDER BY id DESC LIMIT 5");
            $stmt->execute([$userId]);
        }
        $docs = $stmt->fetchAll();

        if (empty($docs)) {
            echo json_encode([
                'success' => true,
                'answer' => "No lecture documents have been uploaded yet. Please upload a course PDF or syllabus document first to ask questions about your course materials.",
                'citations' => [],
                'is_live_ai' => false
            ]);
            exit;
        }

        // Extract chunks and compute relevance score (term frequency / keyword matching)
        $scoredChunks = [];
        $qWords = array_filter(preg_split('/\s+/', mb_strtolower($query, 'UTF-8')), fn($w) => strlen($w) > 2);

        foreach ($docs as $d) {
            $chunks = json_decode($d['chunks_json'] ?? '[]', true) ?: [];
            foreach ($chunks as $c) {
                $text = $c['text'] ?? '';
                $page = (int)($c['page'] ?? 1);
                $lowerText = mb_strtolower($text, 'UTF-8');

                $score = 0;
                foreach ($qWords as $qw) {
                    if (str_contains($lowerText, $qw)) {
                        $score += substr_count($lowerText, $qw) * 2;
                    }
                }

                if ($score > 0) {
                    $scoredChunks[] = [
                        'score' => $score,
                        'filename' => $d['filename'],
                        'page' => $page,
                        'text' => $text
                    ];
                }
            }
        }

        // Sort descending by score
        usort($scoredChunks, fn($a, $b) => $b['score'] <=> $a['score']);
        $topChunks = array_slice($scoredChunks, 0, 3);

        if (empty($topChunks)) {
            echo json_encode([
                'success' => true,
                'answer' => "The uploaded study documents do not contain sufficient information to answer: \"{$query}\". Please check if the relevant lecture notes or chapter are uploaded.",
                'citations' => [],
                'is_live_ai' => false
            ]);
            exit;
        }

        // Build RAG context block
        $ragContextLines = [];
        $citations = [];
        foreach ($topChunks as $tc) {
            $ragContextLines[] = "[Source: {$tc['filename']}, Page {$tc['page']}]\n{$tc['text']}";
            $citations[] = [
                'filename' => $tc['filename'],
                'page' => $tc['page'],
                'snippet' => mb_substr($tc['text'], 0, 120) . '...'
            ];
        }
        $ragContextStr = implode("\n\n---\n\n", $ragContextLines);

        // Fetch user memories for additional context
        $memStmt = $pdo->prepare("SELECT category, title, content FROM personal_memories WHERE user_id = ? AND is_active = 1");
        $memStmt->execute([$userId]);
        $memories = $memStmt->fetchAll();

        // Prompt LLM with strict grounding instructions
        $ragPrompt = <<<PROMPT
You are answering a student's question strictly grounded on their uploaded course documents.

=== RETRIEVED COURSE MATERIAL CHUNKS (RAG) ===
{$ragContextStr}

=== STUDENT QUESTION ===
{$query}

INSTRUCTIONS:
1. Answer the student's question accurately using ONLY the information in the retrieved lecture chunks above.
2. Explicitly cite the document and page number at the end of key points (e.g. `[Source: {$topChunks[0]['filename']}, Page {$topChunks[0]['page']}]`).
3. If the answer is not contained in the provided chunks, say: "The provided study notes do not contain sufficient information to answer this question fully."
PROMPT;

        $aiService = new AIService();
        $aiRes = $aiService->generateResponse($ragPrompt, $memories, $lang, 'Document RAG');

        echo json_encode([
            'success' => true,
            'answer' => $aiRes['message'],
            'citations' => $citations,
            'is_live_ai' => $aiRes['is_live_ai'] ?? false,
            'provider' => $aiRes['provider'] ?? 'rag_engine'
        ], JSON_UNESCAPED_UNICODE);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unknown document action']);
        break;
}
