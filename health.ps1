# OneShot Server Health Check
# Save as: health.ps1

param()

# Clear console for clean output
Clear-Host

Write-Host "🔍 OneShot Server Health Check" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Server health endpoint
$HealthUrl = "http://localhost:3000/health"

try {
    # Make request to health endpoint
    Write-Host "Checking server at: $HealthUrl" -ForegroundColor Yellow
    Write-Host ""
    
    $Response = Invoke-WebRequest -Uri $HealthUrl -Method GET -TimeoutSec 10
    
    # Check if response is successful (200)
    if ($Response.StatusCode -eq 200) {
        Write-Host "✅ Server is healthy!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Status Code: $($Response.StatusCode)" -ForegroundColor Green
        Write-Host "Response Time: Success" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 OneShot application should be accessible at:" -ForegroundColor Cyan
        Write-Host "   http://localhost:3000" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "⚠️  Server responded with unexpected status!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Status Code: $($Response.StatusCode)" -ForegroundColor Yellow
        Write-Host "Status Description: $($Response.StatusDescription)" -ForegroundColor Yellow
        Write-Host ""
    }
    
} catch {
    # Handle connection errors
    $ErrorMessage = $_.Exception.Message
    
    if ($ErrorMessage -like "*connection*refused*" -or $ErrorMessage -like "*ConnectFailure*") {
        Write-Host "⚠️  Server is not running!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Error: Connection refused to localhost:3000" -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 To start the server:" -ForegroundColor Yellow
        Write-Host "   1. Open PowerShell in OneShot project folder" -ForegroundColor White
        Write-Host "   2. Run: cd oneshot-mvp" -ForegroundColor White
        Write-Host "   3. Run: npm start" -ForegroundColor White
        Write-Host ""
    } elseif ($ErrorMessage -like "*timeout*") {
        Write-Host "⚠️  Server request timed out!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Error: Request took longer than 10 seconds" -ForegroundColor Red
        Write-Host "The server might be starting up or experiencing issues." -ForegroundColor Yellow
        Write-Host ""
    } else {
        Write-Host "⚠️  Unexpected error occurred!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Error: $ErrorMessage" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host "Check completed." -ForegroundColor Gray
Write-Host "" 