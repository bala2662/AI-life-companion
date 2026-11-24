<?php
$phpBin = 'C:\\xampp\\php\\php.exe';
if (!file_exists($phpBin)) {
    $phpBin = 'php';
}
$rootDir = dirname(__DIR__, 2);
$dirs = [$rootDir, $rootDir . '/api', $rootDir . '/config', $rootDir . '/includes', $rootDir . '/services'];
$hasError = false;

foreach ($dirs as $d) {
    foreach (glob($d . '/*.php') as $file) {
        $out = [];
        $ret = 0;
        exec(escapeshellarg($phpBin) . " -l " . escapeshellarg($file) . " 2>&1", $out, $ret);
        if ($ret !== 0) {
            echo "SYNTAX ERROR in $file:\n" . implode("\n", $out) . "\n";
            $hasError = true;
        } else {
            echo "OK: " . basename($file) . "\n";
        }
    }
}

if (!$hasError) {
    echo "\nALL PHP FILES PASSED SYNTAX CHECK WITH ZERO ERRORS!\n";
}
