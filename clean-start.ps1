#!/usr/bin/env pwsh

Write-Host "🧹 OneShot Clean Start Script" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

# Kill any running node processes
Write-Host "`n📍 Stopping any running processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

# Clear Next.js cache
Write-Host "`n🗑️  Clearing Next.js cache..." -ForegroundColor Yellow
Remove-Item -Path "apps/web/.next" -Recurse -Force -ErrorAction SilentlyContinue

# Clear node_modules if requested
if ($args -contains "--full") {
    Write-Host "`n🗑️  Removing node_modules (full clean)..." -ForegroundColor Yellow
    Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "apps/web/node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "apps/api/node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    
    Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Create .env file if it doesn't exist
if (!(Test-Path "apps/api/.env")) {
    Write-Host "`n📝 Creating API .env file..." -ForegroundColor Yellow
    "PORT=5001" | Out-File -FilePath "apps/api/.env" -Encoding UTF8
}

Write-Host "`n✅ Clean complete!" -ForegroundColor Green
Write-Host "`n🚀 Starting development servers..." -ForegroundColor Cyan
Write-Host "   - API will run on port 5001" -ForegroundColor Gray
Write-Host "   - Web will run on port 3000" -ForegroundColor Gray
Write-Host "`n" -NoNewline

# Start the development servers
npm run dev 