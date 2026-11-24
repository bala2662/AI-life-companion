<?php
/**
 * Personal Memory API Endpoint
 * Actions: list, add, update, delete, toggle_status, export, wipe, simulate_retrieval
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../config/database.php';

$userId = Auth::requireAuth();
$pdo = Database::getConnection();

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?? [];
if (!empty($input['action'])) {
    $action = $input['action'];
}

switch ($action) {
    case 'list':
        $cat = $_GET['category'] ?? 'all';
        if ($cat !== 'all') {
            $stmt = $pdo->prepare("SELECT * FROM personal_memories WHERE user_id = ? AND category = ? ORDER BY is_confirmed_fact DESC, id DESC");
            $stmt->execute([$userId, $cat]);
        } else {
            $stmt = $pdo->prepare("SELECT * FROM personal_memories WHERE user_id = ? ORDER BY is_confirmed_fact DESC, id DESC");
            $stmt->execute([$userId]);
        }
        $memories = $stmt->fetchAll();
        echo json_encode(['success' => true, 'memories' => $memories], JSON_UNESCAPED_UNICODE);
        break;

    case 'add':
        $category = $input['category'] ?? $_POST['category'] ?? 'learning';
        $title = trim($input['title'] ?? $_POST['title'] ?? '');
        $content = trim($input['content'] ?? $_POST['content'] ?? '');
        $tags = trim($input['tags'] ?? $_POST['tags'] ?? '');
        $isFact = isset($input['is_confirmed_fact']) ? (int)$input['is_confirmed_fact'] : 1;

        if (empty($title) || empty($content)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Title and content are required']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO personal_memories (user_id, category, title, content, is_confirmed_fact, tags) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $category, $title, $content, $isFact, $tags]);
        $newId = (int)$pdo->lastInsertId();

        echo json_encode([
            'success' => true,
            'message' => 'Memory saved to persistent storage',
            'id' => $newId
        ], JSON_UNESCAPED_UNICODE);
        break;

    case 'update':
        $id = (int)($input['id'] ?? 0);
        $title = trim($input['title'] ?? '');
        $content = trim($input['content'] ?? '');
        $category = trim($input['category'] ?? '');

        if (!$id || empty($title) || empty($content)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Valid ID, title, and content are required']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE personal_memories SET title = ?, content = ?, category = COALESCE(NULLIF(?, ''), category) WHERE id = ? AND user_id = ?");
        $stmt->execute([$title, $content, $category, $id, $userId]);

        echo json_encode(['success' => true, 'message' => 'Memory updated successfully']);
        break;

    case 'delete':
        $id = (int)($_GET['id'] ?? $input['id'] ?? 0);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Memory ID required']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM personal_memories WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);

        echo json_encode(['success' => true, 'message' => 'Memory permanently deleted']);
        break;

    case 'toggle_status':
        $id = (int)($input['id'] ?? 0);
        $isActive = (int)($input['is_active'] ?? 1);

        $stmt = $pdo->prepare("UPDATE personal_memories SET is_active = ? WHERE id = ? AND user_id = ?");
        $stmt->execute([$isActive, $id, $userId]);

        echo json_encode(['success' => true, 'message' => 'Status updated']);
        break;

    case 'export':
        $stmt = $pdo->prepare("SELECT category, title, content, is_confirmed_fact, tags, created_at FROM personal_memories WHERE user_id = ?");
        $stmt->execute([$userId]);
        $all = $stmt->fetchAll();

        header('Content-Disposition: attachment; filename="personal_memories_export_' . date('Y-m-d') . '.json"');
        echo json_encode([
            'exported_at' => date('c'),
            'user_id' => $userId,
            'total_memories' => count($all),
            'memories' => $all
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit;

    case 'wipe':
        $stmt = $pdo->prepare("DELETE FROM personal_memories WHERE user_id = ?");
        $stmt->execute([$userId]);
        echo json_encode(['success' => true, 'message' => 'All memories wiped clean']);
        break;

    case 'simulate_retrieval':
        $query = trim($_GET['query'] ?? $input['query'] ?? '');
        if (empty($query)) {
            echo json_encode(['success' => true, 'retrieved' => [], 'reasoning' => 'No query provided']);
            exit;
        }

        $q = mb_strtolower($query, 'UTF-8');
        $stmt = $pdo->prepare("SELECT id, category, title, content, is_confirmed_fact, tags FROM personal_memories WHERE user_id = ? AND is_active = 1");
        $stmt->execute([$userId]);
        $memories = $stmt->fetchAll();

        // Calculate relevance score
        $scored = [];
        $words = preg_split('/\s+/', $q);
        foreach ($memories as $m) {
            $score = 0;
            $text = mb_strtolower($m['title'] . ' ' . $m['content'] . ' ' . $m['tags'], 'UTF-8');
            foreach ($words as $w) {
                if (strlen($w) > 2 && str_contains($text, $w)) {
                    $score += 2;
                }
            }
            if ($score > 0 && $m['is_confirmed_fact']) {
                $score += 1; // bonus for verified facts
            }
            if ($score > 0) {
                $m['relevance_score'] = $score;
                $scored[] = $m;
            }
        }

        usort($scored, fn($a, $b) => $b['relevance_score'] <=> $a['relevance_score']);
        $top = array_slice($scored, 0, 4);

        echo json_encode([
            'success' => true,
            'query' => $query,
            'count' => count($top),
            'retrieved' => $top,
            'reasoning' => count($top) > 0 ? "Matched " . count($top) . " relevant context entities based on query keywords" : "No high-confidence match found for this query"
        ], JSON_UNESCAPED_UNICODE);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unknown memory action']);
        break;
}
