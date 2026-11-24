<?php
$models = ['openai', 'mistral', 'llama'];

foreach ($models as $m) {
    $t0 = microtime(true);
    $url = 'https://text.pollinations.ai/openai';
    $payload = [
        'messages' => [
            ['role' => 'user', 'content' => 'What is quicksort in one sentence?']
        ],
        'model' => $m
    ];
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_SSL_VERIFYPEER => false
    ]);
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $dt = round(microtime(true) - $t0, 2);
    $json = json_decode((string)$res, true);
    $text = $json['choices'][0]['message']['content'] ?? 'NO CONTENT';
    echo "Model '$m': HTTP $code in {$dt}s -> " . substr($text, 0, 70) . "...\n";
}
