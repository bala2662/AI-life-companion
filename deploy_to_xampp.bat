@echo off
cd /d "%~dp0"
title Deploy ALlifeCompanion to XAMPP htdocs
color 0A

echo =========================================================================
echo    DEPLOYING AI UNIFIED LIFE COMPANION TO XAMPP HTDOCS
echo =========================================================================
echo.
set TARGET=C:\xampp\htdocs\ai-life-companion

if not exist "C:\xampp\htdocs\" (
    echo [ERROR] C:\xampp\htdocs does not exist. Please check your XAMPP installation.
    pause
    exit /b 1
)

if not exist "%TARGET%" (
    echo Creating directory: %TARGET%
    mkdir "%TARGET%"
)

echo Copying application files to %TARGET% ...
xcopy /E /I /Y /Q * "%TARGET%"

echo.
echo =========================================================================
echo [SUCCESS] Deployed to %TARGET%
echo.
echo Instructions:
echo 1. Start Apache and MySQL from XAMPP Control Panel.
echo 2. Open http://localhost/phpmyadmin and import database.sql into ai_life_companion.
echo 3. Open your browser at:
echo    http://localhost/ai-life-companion/
echo =========================================================================
pause
