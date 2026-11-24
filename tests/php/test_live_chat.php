<?php
// 1. Login
$ch = curl_init('http://127.0.0.1:8000/api/auth.php?action=demo_login');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_COOKIEJAR => 'cookie.txt'
]);
$res = curl_exec($ch);
curl_close($ch);

// 2. Chat
$ch = curl_init('http://127.0.0.1:8000/api/chat.php');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_COOKIEFILE => 'cookie.txt',
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode([
        'message' => 'What is polymorphism in Java in 2 simple sentences?'
    ])
]);
$res2 = curl_exec($ch);
curl_close($ch);

echo "Chat API Response:\n$res2\n";
