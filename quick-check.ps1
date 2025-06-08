Write-Host "Running OneShot MVP System Verification" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Save the current directory
$originalDir = Get-Location

# Change to oneshot-mvp directory
Set-Location -Path "$originalDir\oneshot-mvp"

Write-Host "`nRunning lint check..." -ForegroundColor Yellow
npm run lint

Write-Host "`nRunning health check..." -ForegroundColor Yellow
npm run health

Write-Host "`nRunning simplicity check..." -ForegroundColor Yellow
npm run simplicity

Write-Host "`nSystem verification complete!" -ForegroundColor Green

# Return to the original directory
Set-Location -Path $originalDir 