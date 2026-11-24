<?php
/**
 * Health, Habits & Wellness API Endpoint
 * Actions: get_habits, log_habit, get_water, update_water
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
    case 'get_habits':
        $today = date('Y-m-d');
        $stmt = $pdo->prepare("SELECT * FROM user_habits WHERE user_id = ? AND last_logged_date = ?");
        $stmt->execute([$userId, $today]);
        $habits = $stmt->fetchAll();

        echo json_encode(['success' => true, 'date' => $today, 'habits' => $habits], JSON_UNESCAPED_UNICODE);
        break;

    case 'log_habit':
        $key = trim($input['habit_key'] ?? '');
        $name = trim($input['habit_name'] ?? 'Daily Habit');
        $amount = (int)($input['amount'] ?? 1);
        $target = (int)($input['target'] ?? 1);
        $unit = trim($input['unit'] ?? 'times');
        $today = date('Y-m-d');

        if (empty($key)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Habit key required']);
            exit;
        }

        $stmt = $pdo->prepare("
            INSERT INTO user_habits (user_id, habit_key, habit_name, target_daily_count, current_count, unit, last_logged_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE current_count = current_count + VALUES(current_count)
        ");
        $stmt->execute([$userId, $key, $name, $target, $amount, $unit, $today]);

        echo json_encode(['success' => true, 'message' => 'Habit logged successfully']);
        break;

    case 'get_water':
        $today = date('Y-m-d');
        $stmt = $pdo->prepare("SELECT current_count, target_daily_count FROM user_habits WHERE user_id = ? AND habit_key = 'water_intake' AND last_logged_date = ?");
        $stmt->execute([$userId, $today]);
        $row = $stmt->fetch();
        $current = $row ? (int)$row['current_count'] : 1750;
        $target = $row ? (int)$row['target_daily_count'] : 2500;

        echo json_encode(['success' => true, 'current_ml' => $current, 'target_ml' => $target]);
        break;

    case 'add_water':
        $addMl = (int)($input['amount_ml'] ?? 250);
        $today = date('Y-m-d');

        $stmt = $pdo->prepare("
            INSERT INTO user_habits (user_id, habit_key, habit_name, target_daily_count, current_count, unit, last_logged_date)
            VALUES (?, 'water_intake', 'Drink 2,500ml Water', 2500, ?, 'ml', ?)
            ON DUPLICATE KEY UPDATE current_count = current_count + VALUES(current_count)
        ");
        $stmt->execute([$userId, $addMl, $today]);

        echo json_encode(['success' => true, 'message' => "Logged {$addMl}ml water"]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unknown health action']);
        break;
}
