#!/usr/bin/env pwsh

Write-Host "🧹 OneShot COMPREHENSIVE Clean Script" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Kill any running node processes
Write-Host "`n📍 Stopping any running processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

# Clear ALL caches as required by CTO
Write-Host "`n🗑️  Clearing ALL caches..." -ForegroundColor Yellow

# Next.js cache
Write-Host "   - Clearing .next cache..." -ForegroundColor Gray
Remove-Item -Path "apps/web/.next" -Recurse -Force -ErrorAction SilentlyContinue

# Turbo cache
Write-Host "   - Clearing .turbo cache..." -ForegroundColor Gray
Remove-Item -Path ".turbo" -Recurse -Force -ErrorAction SilentlyContinue

# Node modules (complete clean as requested)
Write-Host "   - Removing ALL node_modules..." -ForegroundColor Gray
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "apps/web/node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "apps/api/node_modules" -Recurse -Force -ErrorAction SilentlyContinue

# npm cache
Write-Host "   - Clearing npm cache..." -ForegroundColor Gray
npm cache clean --force 2>&1 | Out-Null

# Create .env file with PORT=5001 as required
if (!(Test-Path "apps/api/.env")) {
    Write-Host "`n📝 Creating API .env file with PORT=5001..." -ForegroundColor Yellow
    "PORT=5001" | Out-File -FilePath "apps/api/.env" -Encoding UTF8
}

Write-Host "`n📦 Installing fresh dependencies..." -ForegroundColor Yellow
npm install

Write-Host "`n✅ Comprehensive clean complete!" -ForegroundColor Green
Write-Host "`n🚀 Ready to start development servers..." -ForegroundColor Cyan
Write-Host "   - API will run on port 5001" -ForegroundColor Gray
Write-Host "   - Web will run on port 3000" -ForegroundColor Gray 