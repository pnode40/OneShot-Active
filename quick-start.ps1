#!/usr/bin/env pwsh
# OneShot MVP Quick Start
# Simple script to start the server with minimal output

Write-Host "Starting OneShot MVP..." -ForegroundColor Green

if (-not (Test-Path "oneshot-mvp")) {
    Write-Host "Error: Run this from OneShot-Active root directory" -ForegroundColor Red
    exit 1
}

Set-Location "oneshot-mvp"

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install --silent
}

npm start 