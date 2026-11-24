@echo off
setlocal
rem Change to the directory containing this script
cd /d "%~dp0"

rem Find PHP executable
set "PHP_BIN="
if exist "C:\xampp\php\php.exe" (
    set "PHP_BIN=C:\xampp\php\php.exe"
) else (
    where php >nul 2>&1 && set "PHP_BIN=php"
)

if "%PHP_BIN%"=="" (
    echo [ERROR] PHP executable not found. Install XAMPP or add php to PATH.
    exit /b 1
)

rem Start built‑in server
"%PHP_BIN%" -S 127.0.0.1:8000 router.php
