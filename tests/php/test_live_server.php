<?php
// Test built-in server request execution
$host = '127.0.0.1';
$port = 8099;

// Start php server process
$desc = [
    0 => ['pipe', 'r'],
    1 => ['pipe', 'w'],
    2 => ['pipe', 'w']
];
$cmd = 'C:\\xampp\\php\\php.exe -S ' . $host . ':' . $port . ' router.php';
$proc = proc_open($cmd, $desc, $pipes, __DIR__);

if (!is_resource($proc)) {
    die("Failed to start server\n");
}

// Give server time to bind
usleep(1000000); // 1 sec

function testUrl($url, $method = 'GET', $body = null) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 3);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    if ($body) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    }
    $resp = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    return ['code' => $httpCode, 'resp' => $resp, 'err' => $err];
}

echo "Testing GET / ...\n";
$r1 = testUrl("http://$host:$port/");
echo "HTTP {$r1['code']} (Length: " . strlen($r1['resp']) . ", err: {$r1['err']})\n";

echo "Testing GET /index.php ...\n";
$r2 = testUrl("http://$host:$port/index.php");
echo "HTTP {$r2['code']} (Length: " . strlen($r2['resp']) . ")\n";

echo "Testing POST /api/auth.php?action=demo_login ...\n";
$r3 = testUrl("http://$host:$port/api/auth.php?action=demo_login", 'POST');
echo "HTTP {$r3['code']} Response: " . substr($r3['resp'], 0, 150) . "\n";

echo "Testing GET /app.js ...\n";
$r4 = testUrl("http://$host:$port/app.js");
echo "HTTP {$r4['code']} (Length: " . strlen($r4['resp']) . ")\n";

echo "Testing GET /styles.css ...\n";
$r5 = testUrl("http://$host:$port/styles.css");
echo "HTTP {$r5['code']} (Length: " . strlen($r5['resp']) . ")\n";

// Kill server
proc_terminate($proc);
echo "Done.\n";
