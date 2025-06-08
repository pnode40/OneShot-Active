#!/usr/bin/env pwsh
# OneShot MVP Server Launcher
# Usage: ./start-server.ps1 [option]
# Options: start, dev, quick, health

param(
    [string]$Command = "start"
)

Write-Host "🚀 OneShot MVP Server Launcher" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check if oneshot-mvp directory exists
if (-not (Test-Path "oneshot-mvp")) {
    Write-Host "❌ Error: oneshot-mvp directory not found" -ForegroundColor Red
    Write-Host "Make sure you're running this from the OneShot-Active root directory" -ForegroundColor Yellow
    exit 1
}

# Navigate to the project directory
Write-Host "📁 Navigating to oneshot-mvp directory..." -ForegroundColor Green
Set-Location "oneshot-mvp"

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found in oneshot-mvp directory" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error: Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Run the appropriate command
switch ($Command.ToLower()) {
    "start" {
        Write-Host "🎯 Starting server..." -ForegroundColor Green
        npm start
    }
    "dev" {
        Write-Host "🛠️  Starting in development mode..." -ForegroundColor Green
        npm run dev
    }
    "quick" {
        Write-Host "⚡ Quick start..." -ForegroundColor Green
        npm run quick
    }
    "health" {
        Write-Host "🏥 Running system health check..." -ForegroundColor Green
        npm run system-health
    }
    "test" {
        Write-Host "🧪 Running tests..." -ForegroundColor Green
        npm test
    }
    default {
        Write-Host "❓ Unknown command: $Command" -ForegroundColor Red
        Write-Host "Available commands: start, dev, quick, health, test" -ForegroundColor Yellow
        exit 1
    }
}

# Return to original directory
Set-Location ".." 