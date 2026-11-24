<?php
/**
 * CSRF Protection Utility
 * Platform: PHP 8+
 */

declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    $savePath = session_save_path();
    if (empty($savePath) || !is_dir($savePath) || !is_writable($savePath)) {
        $altPath = sys_get_temp_dir();
        if (is_writable($altPath)) {
            session_save_path($altPath);
        }
    }
    @session_start();
}

class CSRF {
    public static function getToken(): string {
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    public static function validate(?string $token): bool {
        if (empty($token) || empty($_SESSION['csrf_token'])) {
            return false;
        }
        return hash_equals($_SESSION['csrf_token'], $token);
    }

    public static function verifyHeaderOrPost(): bool {
        // Read from header X-CSRF-Token or POST body
        $headerToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
        $postToken = $_POST['csrf_token'] ?? null;

        // If JSON payload, also check decoded json
        if (!$headerToken && !$postToken) {
            $raw = file_get_contents('php://input');
            if ($raw) {
                $data = json_decode($raw, true);
                $postToken = $data['csrf_token'] ?? null;
            }
        }

        $token = $headerToken ?: $postToken;
        return self::validate($token);
    }
}
