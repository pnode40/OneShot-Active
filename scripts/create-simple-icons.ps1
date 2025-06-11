#!/usr/bin/env pwsh

# Create simple PNG icons using .NET
Add-Type -AssemblyName System.Drawing

function Create-PngIcon {
    param (
        [int]$Size,
        [string]$OutputPath
    )
    
    # Create bitmap
    $bitmap = New-Object System.Drawing.Bitmap $Size, $Size
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Fill with OneShot brand color
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(44, 62, 80))
    $graphics.FillRectangle($brush, 0, 0, $Size, $Size)
    
    # Add simple text
    $font = New-Object System.Drawing.Font("Arial", ($Size * 0.3), [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $stringFormat = New-Object System.Drawing.StringFormat
    $stringFormat.Alignment = [System.Drawing.StringAlignment]::Center
    $stringFormat.LineAlignment = [System.Drawing.StringAlignment]::Center
    
    $rect = New-Object System.Drawing.RectangleF(0, 0, $Size, $Size)
    $graphics.DrawString("O1", $font, $textBrush, $rect, $stringFormat)
    
    # Save as PNG
    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Cleanup
    $graphics.Dispose()
    $bitmap.Dispose()
    $brush.Dispose()
    $font.Dispose()
    $textBrush.Dispose()
    
    Write-Host "Created $OutputPath (${Size}x${Size} PNG)"
}

# Create icons
$publicDir = Join-Path -Path $PSScriptRoot -ChildPath "..\apps\web\public"

Create-PngIcon -Size 192 -OutputPath (Join-Path -Path $publicDir -ChildPath "icon-192.png")
Create-PngIcon -Size 512 -OutputPath (Join-Path -Path $publicDir -ChildPath "icon-512.png")

Write-Host "`n✅ Real PNG icons created successfully!" -ForegroundColor Green 