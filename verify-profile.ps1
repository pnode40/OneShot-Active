#!/usr/bin/env pwsh
# OneShot MVP Profile Verification Script
# Usage: ./verify-profile.ps1 [slug]

param(
    [Parameter(Mandatory=$true)]
    [string]$Slug
)

Write-Host "OneShot MVP Profile Verification" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check if oneshot-mvp directory exists
if (-not (Test-Path "oneshot-mvp")) {
    Write-Host "Error: oneshot-mvp directory not found" -ForegroundColor Red
    Write-Host "Make sure you are running this from the OneShot-Active root directory" -ForegroundColor Yellow
    exit 1
}

# Navigate to project directory and run verification
Set-Location "oneshot-mvp"
node scripts/verify-profile-generation.js $Slug

# Return to original directory
Set-Location ".." 