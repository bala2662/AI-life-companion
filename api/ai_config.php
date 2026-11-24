<?php
/**
 * AI Configuration & Live Test Endpoint
 * Actions: get, save, test
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../services/AIService.php';

$userId = Auth::requireAuth();
$configFile = __DIR__ . '/../config/ai_custom.json';

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?? [];
if (!empty($input['action'])) {
    $action = $input['action'];
}

switch ($action) {
    case 'get':
        $custom = file_exists($configFile) ? json_decode(file_get_contents($configFile), true) : [];
        $envKey = getenv('AI_API_KEY') ?: (getenv('OPENAI_API_KEY') ?: '');
        $activeKey = !empty($custom['api_key']) ? $custom['api_key'] : $envKey;
        
        $hasKey = !empty($activeKey) && $activeKey !== 'your-openai-api-key-here';
        $maskedKey = $hasKey ? (substr($activeKey, 0, 4) . '••••••••' . substr($activeKey, -4)) : '';

        echo json_encode([
            'success' => true,
            'has_key' => $hasKey,
            'masked_key' => $maskedKey,
            'provider' => $custom['provider'] ?? 'openai',
            'api_url' => $custom['api_url'] ?? 'https://api.openai.com/v1/chat/completions',
            'model' => $custom['model'] ?? 'gpt-4o-mini'
        ], JSON_UNESCAPED_UNICODE);
        break;

    case 'save':
        $apiKey = trim($input['api_key'] ?? '');
        $apiUrl = trim($input['api_url'] ?? 'https://api.openai.com/v1/chat/completions');
        $model = trim($input['model'] ?? 'gpt-4o-mini');
        $provider = trim($input['provider'] ?? 'openai');

        if (empty($apiKey)) {
            // Remove custom config if empty
            if (file_exists($configFile)) {
                @unlink($configFile);
            }
            echo json_encode(['success' => true, 'message' => 'API key cleared. System returned to local engine.']);
            exit;
        }

        // Test connection first
        $aiService = new AIService();
        $testResult = $aiService->generateResponse('Respond with exactly "AI Connection Verified OK!"', [], 'en', 'Test', $apiKey, $apiUrl, $model);

        if (!$testResult['is_live_ai']) {
            $err = $testResult['notice'] ?? 'Could not verify API Key with provider';
            http_response_code(400);
            echo json_encode([
                'success' => false, 
                'error' => "API Key Verification Failed: {$err}",
                'details' => $err
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // Save validated config
        $saveData = [
            'provider' => $provider,
            'api_key' => $apiKey,
            'api_url' => $apiUrl,
            'model' => $model,
            'updated_at' => date('Y-m-d H:i:s'),
            'updated_by_user_id' => $userId
        ];
        file_put_contents($configFile, json_encode($saveData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        echo json_encode([
            'success' => true, 
            'message' => "Successfully connected to {$provider} ({$model})! All features now use real live AI.",
            'model' => $model,
            'provider' => $provider
        ], JSON_UNESCAPED_UNICODE);
        break;

    case 'test':
        $apiKey = trim($input['api_key'] ?? '');
        $apiUrl = trim($input['api_url'] ?? 'https://api.openai.com/v1/chat/completions');
        $model = trim($input['model'] ?? 'gpt-4o-mini');

        if (empty($apiKey)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'API Key is required to run test']);
            exit;
        }

        $aiService = new AIService();
        $testResult = $aiService->generateResponse('Ping test: answer "Live AI Connection OK"', [], 'en', 'Test', $apiKey, $apiUrl, $model);

        if ($testResult['is_live_ai']) {
            echo json_encode([
                'success' => true,
                'message' => 'Connection to Live LLM API succeeded!',
                'sample_reply' => $testResult['message'],
                'model' => $model
            ], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => $testResult['notice'] ?? 'Live connection test failed.'
            ], JSON_UNESCAPED_UNICODE);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unknown action']);
        break;
}
