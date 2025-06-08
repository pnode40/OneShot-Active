#!/usr/bin/env pwsh
# OneShot MVP Feature Completion Runner
# Usage: ./complete-feature.ps1 <slug>

param(
    [Parameter(Mandatory=$true)]
    [string]$Slug
)

Write-Host "OneShot MVP Feature Completion" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

# Check if oneshot-mvp directory exists
if (-not (Test-Path "oneshot-mvp")) {
    Write-Host "Error: oneshot-mvp directory not found" -ForegroundColor Red
    Write-Host "Make sure you are running this from the OneShot-Active root directory" -ForegroundColor Yellow
    exit 1
}

# Navigate to project directory
Set-Location "oneshot-mvp"

# Run the feature completion script
node scripts/feature-complete.js $Slug

# Return to original directory
Set-Location ".."

Write-Host ""
Write-Host "Feature completion workflow finished!" -ForegroundColor Green
Write-Host "Review changelog: oneshot-mvp/docs/CHANGELOG.md" -ForegroundColor Yellow 