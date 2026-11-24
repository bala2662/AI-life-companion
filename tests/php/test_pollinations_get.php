<?php
$prompt = urlencode("Explain polymorphism in Java in 2 sentences.");
$url = "https://text.pollinations.ai/{$prompt}";

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 20,
    CURLOPT_SSL_VERIFYPEER => false
]);
$t0 = microtime(true);
$res = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
$dt = round(microtime(true) - $t0, 2);

echo "Direct endpoint HTTP $code in {$dt}s:\n$res\n";
