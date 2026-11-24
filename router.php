<?php
declare(strict_types=1);

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';

// If a static file exists (css, js, png, svg, etc.), let PHP built-in server serve it directly
$filePath = __DIR__ . $uri;
$realDir = realpath(__DIR__);
$realPath = realpath($filePath);
if ($uri !== '/' && $uri !== '' && $realPath && str_starts_with($realPath, $realDir) && is_file($realPath)) {
    return false;
}

// Route /api/something to api/something.php
if (preg_match('#^/api/([a-zA-Z0-9_-]+)$#', $uri, $m)) {
    $phpFile = __DIR__ . '/api/' . $m[1] . '.php';
    if (file_exists($phpFile)) {
        require $phpFile;
        exit;
    }
}

// If specific PHP file requested under api/
if (str_starts_with($uri, '/api/') && file_exists($filePath)) {
    require $filePath;
    exit;
}

// All other routes, including '/', load the main app
require __DIR__ . '/index.php';
exit;
