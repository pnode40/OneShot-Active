# Generate Marcus Johnson Profile
$athleteData = @{
    name = "Marcus Johnson"
    position = "Quarterback"
    school = "West Valley High"
    height = "6'2`""
    weight = 185
    gpa = 3.8
    year = "Senior"
}

$json = $athleteData | ConvertTo-Json -Depth 3

Write-Host "Generating Marcus Johnson profile..." -ForegroundColor Green
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/generate-profile" -Method POST -ContentType "application/json" -Body $json

Write-Host "✅ Profile generated successfully!" -ForegroundColor Green
Write-Host "📄 Profile URL: $($response.profileUrl)" -ForegroundColor Cyan
Write-Host "🌐 View at: http://localhost:3000$($response.profileUrl)" -ForegroundColor Yellow 