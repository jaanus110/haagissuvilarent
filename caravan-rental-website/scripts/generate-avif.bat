@echo off
echo AVIF Image Conversion Script
echo ============================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: npm is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

echo Installing dependencies...
call npm install

echo.
echo Starting AVIF conversion...
call node generate-avif.js

echo.
echo Conversion complete!
echo.
echo Press any key to exit...
pause >nul