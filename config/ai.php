<?php
/**
 * AI Provider Configuration
 * Platform: PHP 8+
 * Secure server-side configuration for OpenAI API / compatible LLM endpoints
 */

declare(strict_types=1);

$custom = [];
$customFile = __DIR__ . '/ai_custom.json';
if (file_exists($customFile)) {
    $custom = json_decode((string)file_get_contents($customFile), true) ?: [];
}

// Check local .env file if exists
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        if (str_contains($line, '=')) {
            [$k, $v] = explode('=', $line, 2);
            $k = trim($k);
            $v = trim($v, " \t\n\r\0\x0B\"'");
            if (!empty($k) && !getenv($k)) {
                putenv("{$k}={$v}");
            }
        }
    }
}

$apiKey = !empty($custom['api_key']) ? $custom['api_key'] : (getenv('AI_API_KEY') ?: (getenv('OPENAI_API_KEY') ?: ''));
$apiUrl = !empty($custom['api_url']) ? $custom['api_url'] : (getenv('AI_API_URL') ?: 'https://api.openai.com/v1/chat/completions');
$model = !empty($custom['model']) ? $custom['model'] : (getenv('AI_MODEL') ?: 'gpt-4o-mini');

return [
    // Primary API Key
    'api_key' => $apiKey,

    // Base API Endpoint (compatible with OpenAI, Groq, Ollama, OpenRouter, Gemini v1beta, etc.)
    'api_url' => $apiUrl,

    // Model name (e.g. gpt-4o-mini, gpt-4o, gemini-1.5-flash, llama-3.3-70b-versatile)
    'model' => $model,

    // Provider identifier
    'provider' => $custom['provider'] ?? 'openai',

    // Request timeout in seconds
    'timeout_sec' => 20,

    // Max tokens per response
    'max_tokens' => 1800,

    // Temperature
    'temperature' => 0.5,

    // Supported Languages
    'supported_languages' => ['en', 'ta'],

    // System prompt base identity
    'system_identity' => 'You are AI Life Companion, a world-class conversational AI assistant like ChatGPT. You are knowledgeable, intelligent, direct, and exceptionally helpful across all domains: general knowledge, software engineering, coding in any language, mathematics, algorithms, database systems, science, study planning, exam preparation, and daily life. You can hold natural follow-up conversations. When explaining technical topics to students, use clear conceptual breakdowns, real-world analogies, and runnable code examples with comments. Fluently answer in English and Tamil (தமிழ்).'
];
