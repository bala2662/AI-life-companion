@echo off
title AI Life Companion - Local Server
color 0A
cd /d "%~dp0"

echo =========================================================================
echo       AI LIFE COMPANION FOR STUDENTS - LOCAL DEV SERVER
echo =========================================================================
echo.

set PHP_BIN=
if exist "C:\xampp\php\php.exe" (
    set "PHP_BIN=C:\xampp\php\php.exe"
) else (
    where php >nul 2>&1
    if not errorlevel 1 set "PHP_BIN=php"
)

if "%PHP_BIN%"=="" (
    color 0C
    echo [ERROR] PHP executable was not found on your system.
    echo Please ensure XAMPP is installed at C:\xampp or PHP is added to Windows PATH.
    echo.
    pause
    exit /b 1
)

echo [1/3] Terminating previous PHP server instances...
taskkill /F /IM php.exe >nul 2>&1

echo [2/3] Opening browser to http://127.0.0.1:8000/index.php ...
start http://127.0.0.1:8000/index.php

echo [3/3] Starting PHP server using: %PHP_BIN%
echo.
echo =========================================================================
echo Server is actively running at: http://127.0.0.1:8000
echo SQLite fallback & MySQL PDO database modes ready.
echo Keep this terminal window open while using the application.
echo =========================================================================
echo.

"%PHP_BIN%" -S 127.0.0.1:8000 router.php
pause
