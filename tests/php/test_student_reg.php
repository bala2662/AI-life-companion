<?php
require_once __DIR__ . '/../includes/auth.php';

try {
    $res = Auth::register('Kavitha S', 'kavitha@student.edu', 'Student@123', 'Computer Science (Year 2)');
    echo "REGISTRATION_RESULT: " . json_encode($res) . "\n";
} catch (Throwable $e) {
    echo "REGISTRATION_EXCEPTION: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n";
}
