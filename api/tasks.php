<?php
/**
 * Tasks & Commitments API Endpoint
 * Actions: list, add, update, toggle, delete
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
        $filter = $_GET['filter'] ?? 'all';
        if ($filter === 'pending') {
            $stmt = $pdo->prepare("SELECT * FROM tasks WHERE user_id = ? AND is_completed = 0 ORDER BY priority DESC, due_date ASC");
        } elseif ($filter === 'completed') {
            $stmt = $pdo->prepare("SELECT * FROM tasks WHERE user_id = ? AND is_completed = 1 ORDER BY completed_at DESC");
        } else {
            $stmt = $pdo->prepare("SELECT * FROM tasks WHERE user_id = ? ORDER BY is_completed ASC, priority DESC, due_date ASC");
        }
        $stmt->execute([$userId]);
        $tasks = $stmt->fetchAll();
        echo json_encode(['success' => true, 'tasks' => $tasks], JSON_UNESCAPED_UNICODE);
        break;

    case 'add':
        $title = trim($input['title'] ?? $_POST['title'] ?? '');
        $category = trim($input['category'] ?? $_POST['category'] ?? 'academic');
        $priority = trim($input['priority'] ?? $_POST['priority'] ?? 'medium');
        $dueDate = trim($input['due_date'] ?? $_POST['due_date'] ?? '') ?: null;
        $dueTime = trim($input['due_time'] ?? $_POST['due_time'] ?? '') ?: null;
        $estMin = (int)($input['estimated_minutes'] ?? $_POST['estimated_minutes'] ?? 45);

        if (empty($title)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Task title is required']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO tasks (user_id, title, category, priority, due_date, due_time, estimated_minutes) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $title, $category, $priority, $dueDate, $dueTime, $estMin]);
        $id = (int)$pdo->lastInsertId();

        echo json_encode(['success' => true, 'message' => 'Task created successfully', 'id' => $id]);
        break;

    case 'toggle':
        $id = (int)($input['id'] ?? $_POST['id'] ?? 0);
        $done = (int)($input['is_completed'] ?? $_POST['is_completed'] ?? 1);
        $completedAt = $done ? date('Y-m-d H:i:s') : null;

        $stmt = $pdo->prepare("UPDATE tasks SET is_completed = ?, completed_at = ? WHERE id = ? AND user_id = ?");
        $stmt->execute([$done, $completedAt, $id, $userId]);

        echo json_encode(['success' => true, 'message' => 'Task status updated']);
        break;

    case 'delete':
        $id = (int)($_GET['id'] ?? $input['id'] ?? 0);
        $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);
        echo json_encode(['success' => true, 'message' => 'Task deleted']);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unknown task action']);
        break;
}
