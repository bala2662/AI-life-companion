<?php
/**
 * Authentication API Endpoint
 * Actions: login, demo_login, register, logout, me, update_profile, forgot_password, reset_password, csrf_token
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

$action = $_GET['action'] ?? $_POST['action'] ?? '';

// If raw JSON body provided
$input = json_decode(file_get_contents('php://input'), true) ?? [];
if (!empty($input['action'])) {
    $action = $input['action'];
}

switch ($action) {
    case 'me':
        $user = Auth::user();
        echo json_encode([
            'success' => true, 
            'authenticated' => ($user !== null),
            'user' => $user
        ], JSON_UNESCAPED_UNICODE);
        break;

    case 'login':
        $email = $input['email'] ?? $_POST['email'] ?? '';
        $password = $input['password'] ?? $_POST['password'] ?? '';
        $res = Auth::attempt($email, $password);
        if (!$res['success']) {
            http_response_code(401);
        }
        echo json_encode($res, JSON_UNESCAPED_UNICODE);
        break;

    case 'demo_login':
        $res = Auth::demoLogin();
        if (!$res['success']) {
            http_response_code(500);
        }
        echo json_encode($res, JSON_UNESCAPED_UNICODE);
        break;

    case 'register':
        $name = $input['name'] ?? $_POST['name'] ?? '';
        $email = $input['email'] ?? $_POST['email'] ?? '';
        $password = $input['password'] ?? $_POST['password'] ?? '';
        $level = $input['learning_level'] ?? $_POST['learning_level'] ?? 'Beginner (Java)';
        $res = Auth::register($name, $email, $password, $level);
        if (!$res['success']) {
            http_response_code(400);
        }
        echo json_encode($res, JSON_UNESCAPED_UNICODE);
        break;

    case 'forgot_password':
        $email = $input['email'] ?? $_POST['email'] ?? '';
        $res = Auth::forgotPassword($email);
        if (!$res['success']) {
            http_response_code(400);
        }
        echo json_encode($res, JSON_UNESCAPED_UNICODE);
        break;

    case 'reset_password':
        $token = $input['token'] ?? $_POST['token'] ?? '';
        $newPassword = $input['password'] ?? $_POST['password'] ?? '';
        $res = Auth::resetPassword($token, $newPassword);
        if (!$res['success']) {
            http_response_code(400);
        }
        echo json_encode($res, JSON_UNESCAPED_UNICODE);
        break;

    case 'logout':
        Auth::logout();
        echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
        break;

    case 'update_profile':
        $userId = Auth::requireAuth();
        $name = trim($input['name'] ?? '');
        $learningLevel = trim($input['learning_level'] ?? '');
        $lang = trim($input['language_pref'] ?? 'en');

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE users SET name = COALESCE(NULLIF(?, ''), name), learning_level = COALESCE(NULLIF(?, ''), learning_level), language_pref = COALESCE(NULLIF(?, ''), language_pref) WHERE id = ?");
        $stmt->execute([$name, $learningLevel, $lang, $userId]);

        echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
        break;

    case 'csrf_token':
        echo json_encode(['success' => true, 'csrf_token' => CSRF::getToken()]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unknown auth action']);
        break;
}
