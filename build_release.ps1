# Read version from VERSION file
$version = Get-Content -Path "VERSION" -Raw
$version = $version.Trim()

Write-Host "Building version: $version"

# Update app.go
$appGoPath = "app.go"
$appGoContent = Get-Content -Path $appGoPath -Raw
$appGoContent = $appGoContent -replace 'return "\d+" // TODO: Read from build flags or config', "return `"$version`" // TODO: Read from build flags or config"
Set-Content -Path $appGoPath -Value $appGoContent

# Update version.json
$versionJsonPath = "version.json"
$versionJsonContent = Get-Content -Path $versionJsonPath -Raw
$versionJsonContent = $versionJsonContent -replace '"version": "\d+"', "`"version`": `"$version`""
Set-Content -Path $versionJsonPath -Value $versionJsonContent

# Build the app
Write-Host "Running wails build..."
wails build -ldflags "-s -w"

Write-Host "Build complete for version $version"
