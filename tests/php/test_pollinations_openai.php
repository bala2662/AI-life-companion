<?php
$url = 'https://text.pollinations.ai/openai';

$payload = [
    'messages' => [
        [
            'role' => 'system',
            'content' => 'You are an AI study assistant for college students. Answer clearly.'
        ],
        [
            'role' => 'user',
            'content' => 'What is polymorphism in Java in 2 sentences?'
        ]
    ],
    'model' => 'openai',
    'temperature' => 0.5
];

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 25,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json'
    ],
    CURLOPT_SSL_VERIFYPEER => false
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Error: $err\n";
echo "Response Length: " . strlen((string)$response) . "\n";
echo "Response:\n" . $response . "\n";
