<?php
$_SERVER['REQUEST_METHOD'] = 'POST';
$input = [
    'message' => 'Tell me how to use Java inheritance for a beginner',
    'lang' => 'en',
    'intent' => 'Learning'
];
$raw = json_encode($input);
// We can test AIService directly
require_once __DIR__ . '/../services/AIService.php';
$ai = new AIService();
$res = $ai->generateResponse($input['message'], [], 'en', 'Learning');
echo "AI Response Status:\n";
echo "is_live_ai: " . ($res['is_live_ai'] ? 'true' : 'false') . "\n";
echo "provider: " . $res['provider'] . "\n";
echo "reply excerpt: " . substr($res['message'], 0, 150) . "...\n";
