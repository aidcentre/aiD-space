<#
Build the backend image locally and push it to Azure Container Registry.

    powershell -ExecutionPolicy Bypass -File scripts\build_and_push.ps1

Used instead of `az acr build` because ACR Tasks is not permitted on this
subscription (TasksOperationsNotAllowed). Requires Docker Desktop running.

The first push moves ~2-3 GB and will be slow on a home connection. Later
pushes are far smaller: torch and the model sit in early, stable layers, so
only the application layer changes when you edit code.
#>

[CmdletBinding()]
param(
    [string]$Registry = 'acrragdemo',
    [string]$Image    = 'aid-backend',
    [string]$Tag      = 'v1'
)

$ErrorActionPreference = 'Stop'

# Azure CLI is often missing from PATH in a shell opened before it was
# installed, so fall back to the standard install location.
$az = (Get-Command az -ErrorAction SilentlyContinue).Source
if (-not $az) { $az = 'C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin\az.cmd' }
if (-not (Test-Path $az)) { throw 'Azure CLI not found. Install it, then reopen the terminal.' }

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw 'docker not found. Install Docker Desktop, start it, then reopen the terminal.'
}

docker info *> $null
if ($LASTEXITCODE -ne 0) { throw 'Docker daemon is not responding. Start Docker Desktop and wait for it to report Running.' }

$repoRoot = Split-Path $PSScriptRoot -Parent
Push-Location $repoRoot
try {
    $fullTag = "$Registry.azurecr.io/$Image`:$Tag"

    Write-Host "==> Signing in to $Registry" -ForegroundColor Cyan
    & $az acr login --name $Registry
    if ($LASTEXITCODE -ne 0) { throw "az acr login failed" }

    Write-Host "==> Building $fullTag (first run takes ~15 min)" -ForegroundColor Cyan
    docker build --platform linux/amd64 -t $fullTag .
    if ($LASTEXITCODE -ne 0) { throw 'docker build failed' }

    $size = docker image inspect $fullTag --format '{{.Size}}'
    Write-Host ("==> Built. Image size: {0:N2} GB" -f ($size / 1GB)) -ForegroundColor Green

    Write-Host "==> Pushing to $Registry" -ForegroundColor Cyan
    docker push $fullTag
    if ($LASTEXITCODE -ne 0) { throw 'docker push failed' }

    Write-Host "`n==> Done: $fullTag" -ForegroundColor Green
    Write-Host 'Next: deploy it with the az containerapp update command in DEPLOY.md step 5.'
}
finally {
    Pop-Location
}
