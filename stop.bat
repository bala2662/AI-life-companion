@echo off
title Stop AI Life Companion Server
color 0C
echo Stopping PHP Server...
taskkill /F /IM php.exe >nul 2>&1
echo [SUCCESS] Server stopped.
timeout /t 2 >nul
