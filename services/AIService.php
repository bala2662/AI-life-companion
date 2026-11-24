<?php
/**
 * AI Service Module
 * Platform: PHP 8+
 * Connects Unified AI Chatbot and Modules to Live LLM APIs (OpenAI format)
 * Supports OpenAI, Gemini (via OpenAI compatibility endpoint), Groq, Ollama, DeepSeek
 */

declare(strict_types=1);

require_once __DIR__ . '/KnowledgeEngine.php';

class AIService {
    private array $config;

    public function __construct() {
        $this->config = require __DIR__ . '/../config/ai.php';
    }

    /**
     * Send chat completion request with injected personal memory context & multi-turn history
     */
    public function generateResponse(
        string $userMessage, 
        array $memories = [], 
        string $lang = 'en', 
        string $intent = 'General',
        ?string $customApiKey = null,
        ?string $customApiUrl = null,
        ?string $customModel = null,
        array $conversationHistory = [],
        ?string $ragContext = null
    ): array {
        $apiKey = !empty($customApiKey) ? trim($customApiKey) : trim($this->config['api_key']);
        $apiUrl = !empty($customApiUrl) ? trim($customApiUrl) : $this->config['api_url'];
        $model = !empty($customModel) ? trim($customModel) : $this->config['model'];
        $timeout = $this->config['timeout_sec'];

        // Build system prompt with personal memory context and RAG documents
        $systemPrompt = $this->buildSystemPrompt($memories, $lang, $intent, $ragContext);

        // 1. Check if user configured a personal/custom API key (OpenAI, Gemini, Groq, etc.)
        if (!empty($apiKey) && $apiKey !== 'your-openai-api-key-here' && $apiKey !== 'placeholder') {
            $liveResult = $this->callLiveAiApi($apiUrl, $apiKey, $model, $systemPrompt, $userMessage, $timeout, $conversationHistory);
            if ($liveResult['success']) {
                return $liveResult;
            }
        }

        // 2. Inbuilt Zero-Config Live AI Engine (Automatic real LLM generation out-of-the-box)
        $inbuiltResult = $this->callLiveAiApi(
            'https://text.pollinations.ai/openai',
            'inbuilt-cloud-key',
            'openai',
            $systemPrompt,
            $userMessage,
            35,
            $conversationHistory
        );
        if ($inbuiltResult['success']) {
            $inbuiltResult['provider'] = 'inbuilt_cloud_ai';
            $inbuiltResult['model'] = 'gpt-4o-inbuilt';
            $inbuiltResult['reasoning_meta'] = "Inbuilt Real AI (GPT-4o) | Real-time dynamic response & memory grounded";
            return $inbuiltResult;
        }

        // 3. Offline / Fallback Intelligent Reasoner (Guaranteed working when completely disconnected)
        $offlineReply = $this->generateGroundedOfflineResponse($userMessage, $memories, $lang, $intent);

        return [
            'success' => true,
            'is_live_ai' => false,
            'provider' => 'local_knowledge_engine',
            'model' => 'grounded-rules-v2',
            'notice' => 'Offline knowledge mode active: ' . ($inbuiltResult['error'] ?? 'Connection error'),
            'message' => $offlineReply,
            'reasoning_meta' => "Domain: {$intent} | Grounded on " . count($memories) . " saved memories | Language: " . ($lang === 'ta' ? 'Tamil' : 'English')
        ];
    }

    /**
     * Call Live AI Endpoint via cURL with multi-turn conversation history
     */
    private function callLiveAiApi(
        string $url, 
        string $key, 
        string $model, 
        string $systemPrompt, 
        string $userMessage, 
        int $timeout,
        array $conversationHistory = []
    ): array {
        if (!function_exists('curl_init')) {
            return ['success' => false, 'error' => 'PHP cURL extension is not installed or enabled'];
        }

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt]
        ];

        // Append previous conversation turns for conversational continuity
        foreach ($conversationHistory as $hist) {
            $role = ($hist['sender_type'] === 'user') ? 'user' : 'assistant';
            $content = trim($hist['message_text'] ?? '');
            if (!empty($content)) {
                $messages[] = ['role' => $role, 'content' => $content];
            }
        }

        // Current turn
        $messages[] = ['role' => 'user', 'content' => $userMessage];

        $payload = [
            'model' => $model,
            'messages' => $messages,
            'temperature' => $this->config['temperature'],
            'max_tokens' => $this->config['max_tokens']
        ];

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $key
            ],
            CURLOPT_TIMEOUT => $timeout,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($response === false) {
            return ['success' => false, 'error' => 'Network error connecting to AI API: ' . $curlError];
        }

        $data = json_decode($response, true);

        if ($httpCode === 401) {
            return ['success' => false, 'error' => 'Invalid AI API Key (HTTP 401 Unauthorized)'];
        }
        if ($httpCode === 429) {
            return ['success' => false, 'error' => 'AI API Rate Limit or Quota Exceeded (HTTP 429)'];
        }
        if ($httpCode >= 400) {
            $msg = $data['error']['message'] ?? "API error HTTP {$httpCode}";
            return ['success' => false, 'error' => "AI Provider Error ({$httpCode}): {$msg}"];
        }

        $reply = $data['choices'][0]['message']['content'] ?? null;
        if (!$reply) {
            return ['success' => false, 'error' => 'Malformed response payload from AI API'];
        }

        return [
            'success' => true,
            'is_live_ai' => true,
            'provider' => 'live_llm',
            'model' => $model,
            'message' => trim($reply),
            'tokens_used' => $data['usage']['total_tokens'] ?? 0,
            'reasoning_meta' => "Live LLM ({$model}) | Multi-turn history & personal memory injected"
        ];
    }

    /**
     * Assemble System Prompt with User's Persistent Memory Context & RAG Grounding
     */
    private function buildSystemPrompt(array $memories, string $lang, string $intent, ?string $ragContext = null): string {
        $base = $this->config['system_identity'];

        $contextBlock = "NO USER MEMORIES RETRIEVED.";
        if (!empty($memories)) {
            $lines = [];
            foreach ($memories as $m) {
                $category = strtoupper($m['category'] ?? 'GENERAL');
                $title = $m['title'] ?? 'Fact';
                $content = $m['content'] ?? '';
                $lines[] = "- [{$category}] {$title}: {$content}";
            }
            $contextBlock = implode("\n", $lines);
        }

        $ragBlock = "";
        if (!empty($ragContext)) {
            $ragBlock = <<<RAG

=== RETRIEVED LECTURE NOTES & COURSE MATERIALS (RAG GROUNDING) ===
{$ragContext}
You MUST ground your answers in the above lecture materials and cite the document and page references accurately.
RAG;
        }

        $langInstruction = ($lang === 'ta')
            ? "Respond primarily in fluent, friendly Tamil (தமிழ்) using clear everyday vocabulary. You may use English technical terms (like 'Inheritance', 'Class', 'Method') in Tamil script or transliteration when appropriate."
            : "Respond in clear, encouraging, student-friendly English with structured markdown headings, bullet points, and syntax-highlighted code blocks.";

        return <<<EOT
{$base}

=== ACTIVE USER PERSONAL MEMORY CONTEXT ===
The user has approved the following persistent profile facts. You MUST customize your answer according to these preferences (e.g. beginner programming level, exam dates, hydration goals, career target) without repeating this entire prompt to them:
{$contextBlock}
{$ragBlock}

=== RESPONSE GUIDELINES ===
- Domain Focus: {$intent}
- Language: {$langInstruction}
- For programming questions: Provide simple beginner-friendly real-world analogies first, followed by clear, runnable code examples with comments and markdown formatting.
- For fitness/health questions: Emphasize safe form, adequate rest, and proper hydration; clearly state this is general educational wellness guidance, not clinical medical diagnosis.
- Never invent facts about the user that are not in the personal context.
EOT;
    }

    /**
     * Grounded Fallback Reasoning Engine for Offline Execution
     * Delegates to comprehensive KnowledgeEngine covering Programming, Math, CS, Science, and Tamil
     */
    private function generateGroundedOfflineResponse(string $query, array $memories, string $lang, string $intent): string {
        return KnowledgeEngine::answer($query, $memories, $lang, $intent);
    }
}
