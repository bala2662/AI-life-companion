<?php
// Test Summarize via live HTTP
$ch = curl_init('http://127.0.0.1:8000/api/notes.php?action=summarize');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_COOKIEFILE => 'cookie.txt',
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode([
        'content' => "Lecture 3: Relational Database Normalization\nNormalization is the process of organizing data in a database to reduce redundancy and improve data integrity. 1NF ensures atomic columns and no repeating groups. 2NF removes partial functional dependencies where non-prime attributes depend on a part of candidate key. 3NF removes transitive dependencies where non-prime attribute depends on another non-prime attribute.\nBoyce-Codd Normal Form (BCNF) is a stricter version of 3NF where for every functional dependency X -> Y, X must be a super key.",
        'length' => 'medium',
        'format' => 'structured'
    ])
]);
$res = curl_exec($ch);
curl_close($ch);

echo "Summarize API Response:\n$res\n";
