@echo off
:: OneShot MVP Server Launcher (Batch Version)
:: Usage: start-server.bat [option]
:: Options: start, dev, quick, health

setlocal

set "COMMAND=%~1"
if "%COMMAND%"=="" set "COMMAND=start"

echo.
echo 🚀 OneShot MVP Server Launcher
echo ================================

:: Check if oneshot-mvp directory exists
if not exist "oneshot-mvp" (
    echo ❌ Error: oneshot-mvp directory not found
    echo Make sure you're running this from the OneShot-Active root directory
    exit /b 1
)

:: Navigate to the project directory
echo 📁 Navigating to oneshot-mvp directory...
cd /d "oneshot-mvp"

:: Check if package.json exists
if not exist "package.json" (
    echo ❌ Error: package.json not found in oneshot-mvp directory
    exit /b 1
)

:: Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ Error: Failed to install dependencies
        exit /b 1
    )
)

:: Run the appropriate command
if /i "%COMMAND%"=="start" (
    echo 🎯 Starting server...
    call npm start
) else if /i "%COMMAND%"=="dev" (
    echo 🛠️ Starting in development mode...
    call npm run dev
) else if /i "%COMMAND%"=="quick" (
    echo ⚡ Quick start...
    call npm run quick
) else if /i "%COMMAND%"=="health" (
    echo 🏥 Running system health check...
    call npm run system-health
) else if /i "%COMMAND%"=="test" (
    echo 🧪 Running tests...
    call npm test
) else (
    echo ❓ Unknown command: %COMMAND%
    echo Available commands: start, dev, quick, health, test
    exit /b 1
)

:: Return to original directory
cd .. 