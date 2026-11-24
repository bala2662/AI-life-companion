<?php
require_once __DIR__ . '/../../services/AIService.php';

echo "1. Testing Inbuilt Real AI for Unified Chatbot...\n";
$ai = new AIService();
$res = $ai->generateResponse(
    "Explain what is a binary search tree in one paragraph and give one practical use case.",
    [['category' => 'learning', 'title' => 'Student Level', 'content' => 'Beginner Java student']],
    'en',
    'Learning'
);

echo "Success: " . ($res['success'] ? 'YES' : 'NO') . "\n";
echo "Is Live AI: " . ($res['is_live_ai'] ? 'YES' : 'NO') . "\n";
echo "Provider: " . $res['provider'] . "\n";
echo "Model: " . $res['model'] . "\n";
echo "AI Response Preview:\n" . substr($res['message'], 0, 300) . "...\n\n";

echo "2. Testing Inbuilt Real AI for Document Summarization...\n";
$sampleLecture = <<<DOC
Lecture 5: Sorting Algorithms
Quicksort is an efficient, divide-and-conquer sorting algorithm. It works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot. 
Average time complexity: O(n log n). Worst case time complexity: O(n^2) when pivot is unbalanced. Space complexity: O(log n) for call stack.
DOC;

$prompt = "Summarize this lecture material with 3 key points and time complexity table:\n\n" . $sampleLecture;
$res2 = $ai->generateResponse($prompt, [], 'en', 'Summary');

echo "Success: " . ($res2['success'] ? 'YES' : 'NO') . "\n";
echo "Is Live AI: " . ($res2['is_live_ai'] ? 'YES' : 'NO') . "\n";
echo "Notice: " . ($res2['notice'] ?? 'none') . "\n";
echo "Provider: " . ($res2['provider'] ?? 'none') . "\n";
echo "Summary Preview:\n" . substr($res2['message'], 0, 300) . "...\n";
