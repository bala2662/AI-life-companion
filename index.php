<?php
/**
 * Main Application Entry Point
 * Platform: PHP 8+, MySQL PDO, UTF-8
 * Hosts the Unified AI Life Companion Application
 */

declare(strict_types=1);

header('Content-Type: text/html; charset=UTF-8');

require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/csrf.php';

$currentUser = Auth::user();
$csrfToken = CSRF::getToken();

// Load the main application template
$html = file_get_contents(__DIR__ . '/index.html');

// Inject active session context & CSRF token directly into the head
$injectedMeta = '<meta name="csrf-token" content="' . htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') . '">' . "\n"
  . '<script>window.ACTIVE_USER = ' . json_encode($currentUser, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE) . '; window.CSRF_TOKEN = "' . htmlspecialchars($csrfToken, ENT_QUOTES, 'UTF-8') . '";</script>' . "\n";

$html = str_replace('<head>', "<head>\n  " . $injectedMeta, $html);

// Ensure user name in sidebar and header reflects session
if ($currentUser) {
    $html = str_replace('Alex Smith', htmlspecialchars($currentUser['name'] ?? 'Alex Smith', ENT_QUOTES, 'UTF-8'), $html);
}

echo $html;
