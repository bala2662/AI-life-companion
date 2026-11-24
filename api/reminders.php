<?php
/**
 * Reminders & Alarms API Endpoint
 * Actions: list, add, toggle, delete
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
        $stmt = $pdo->prepare("SELECT * FROM reminders WHERE user_id = ? ORDER BY is_active DESC, reminder_time ASC");
        $stmt->execute([$userId]);
        $reminders = $stmt->fetchAll();
        echo json_encode(['success' => true, 'reminders' => $reminders], JSON_UNESCAPED_UNICODE);
        break;

    case 'add':
        $title = trim($input['title'] ?? $_POST['title'] ?? '');
        $category = trim($input['category'] ?? $_POST['category'] ?? 'study');
        $time = trim($input['reminder_time'] ?? $_POST['reminder_time'] ?? '08:00:00');
        $days = trim($input['repeat_days'] ?? $_POST['repeat_days'] ?? 'Mon,Tue,Wed,Thu,Fri');
        $sound = isset($input['sound_enabled']) ? (int)$input['sound_enabled'] : 1;
        $tone = trim($input['tone'] ?? 'chime');

        if (empty($title)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Title is required']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO reminders (user_id, title, category, reminder_time, repeat_days, sound_enabled, tone, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)");
        $stmt->execute([$userId, $title, $category, $time, $days, $sound, $tone]);
        $id = (int)$pdo->lastInsertId();

        echo json_encode(['success' => true, 'message' => 'Reminder scheduled successfully', 'id' => $id]);
        break;

    case 'toggle':
        $id = (int)($input['id'] ?? 0);
        $active = (int)($input['is_active'] ?? 1);

        $stmt = $pdo->prepare("UPDATE reminders SET is_active = ? WHERE id = ? AND user_id = ?");
        $stmt->execute([$active, $id, $userId]);

        echo json_encode(['success' => true, 'message' => 'Alarm status updated']);
        break;

    case 'delete':
        $id = (int)($_GET['id'] ?? $input['id'] ?? 0);
        $stmt = $pdo->prepare("DELETE FROM reminders WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);
        echo json_encode(['success' => true, 'message' => 'Reminder removed']);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unknown reminder action']);
        break;
}
