# ==============================================
# Desnative Calculator Build Script
# ==============================================

# Clear the console for a clean start
Clear-Host

# Read version from VERSION file
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Desnative Calculator Build Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$version = Get-Content -Path "VERSION" -Raw
$version = $version.Trim()

Write-Host "[1/5] Version Information" -ForegroundColor Yellow
Write-Host "      Building version: " -NoNewline
Write-Host "$version" -ForegroundColor Green
Write-Host ""

# Update app.go
Write-Host "[2/5] Updating Source Files" -ForegroundColor Yellow
$appGoPath = "app.go"
$appGoContent = Get-Content -Path $appGoPath -Raw
$appGoContent = $appGoContent -replace 'return "\d+" // TODO: Read from build flags or config', "return `"$version`" // TODO: Read from build flags or config"
Set-Content -Path $appGoPath -Value $appGoContent
Write-Host "      Updated app.go" -ForegroundColor Gray

# Update version.json (version number and release notes)
$versionJsonPath = "version.json"
$versionJsonContent = Get-Content -Path $versionJsonPath -Raw
$versionJsonContent = $versionJsonContent -replace '"version": "\d+"', "`"version`": `"$version`""
$versionJsonContent = $versionJsonContent -replace '"releaseNotes": "Version \d+ release.*?"', "`"releaseNotes`": `"Version $version release.`""
Set-Content -Path $versionJsonPath -Value $versionJsonContent
Write-Host "      Updated version.json" -ForegroundColor Gray
Write-Host ""

# Build the app
Write-Host "[3/5] Building Application" -ForegroundColor Yellow
Write-Host "      This may take 20-30 seconds..." -ForegroundColor Gray
Write-Host ""
wails build -ldflags "-s -w"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[4/5] Build Complete!" -ForegroundColor Yellow
    Write-Host "      Version $version built successfully" -ForegroundColor Green
    Write-Host "      Location: build\bin\desnative.exe" -ForegroundColor Gray
    Write-Host ""
    
    # Git operations
    Write-Host "[5/5] Git Operations" -ForegroundColor Yellow
    Write-Host "      Staging changes..." -ForegroundColor Gray
    git add .
    
    Write-Host "      Committing changes..." -ForegroundColor Gray
    git commit -m "upgrade version"
    
    Write-Host "      Pushing to remote..." -ForegroundColor Gray
    git push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "      Git sync complete!" -ForegroundColor Green
    }
    else {
        Write-Host "      Git push failed (check network/auth)" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "  Success!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Cyan
}
else {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Red
    Write-Host "  Build Failed!" -ForegroundColor Red
    Write-Host "================================================" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
