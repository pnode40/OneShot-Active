#!/usr/bin/env pwsh
# OneShot MVP Feature Logger
# Usage: ./log-feature.ps1 <type> <scope> [--interactive]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('feat', 'fix', 'chore', 'docs')]
    [string]$Type,
    
    [Parameter(Mandatory=$true)]
    [string]$Scope,
    
    [switch]$Interactive
)

Write-Host "📝 OneShot MVP Feature Logger" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

# Check if oneshot-mvp directory exists
if (-not (Test-Path "oneshot-mvp")) {
    Write-Host "Error: oneshot-mvp directory not found" -ForegroundColor Red
    Write-Host "Make sure you are running this from the OneShot-Active root directory" -ForegroundColor Yellow
    exit 1
}

# Navigate to project directory
Set-Location "oneshot-mvp"

# Build command
$command = "node scripts/log-changelog-entry.js $Type $Scope"
if ($Interactive) {
    $command += " --interactive"
}

# Execute the changelog script
Invoke-Expression $command

# Return to original directory
Set-Location ".."

Write-Host ""
Write-Host "📖 View changelog: oneshot-mvp/docs/CHANGELOG.md" -ForegroundColor Green 