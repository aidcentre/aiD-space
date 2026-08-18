<#
End-to-end deploy of this backend to a fresh Azure account.

    az login
    powershell -ExecutionPolicy Bypass -File scripts\azure_deploy.ps1

Idempotent: every step checks for the resource before creating it, so a failed
run can be re-run without cleaning up first.

Secrets are read from .env, never stored here. This file is committed; .env is
not. Do not add key values to this script.

What it does, in order:
  1. enables the Cosmos vector + full-text capabilities (the control-plane step
     that scripts/provision.py cannot do with a data-plane key)
  2. builds the image in Azure with `az acr build` - no local Docker needed
  3. creates the Container Apps managed environment, if absent
  4. creates or updates the Container App with the right size, port and secrets
  5. prints the FQDN and the next command to run

Cosmos and the Container App do not have to share a region. The previous
deployment ran the app in Norway East against Cosmos in Germany West Central.
#>

[CmdletBinding()]
param(
    [string]$ResourceGroup   = 'stf-asc-export',
    [string]$Registry        = 'aidrag',
    [string]$Image           = 'aid-backend',
    [string]$Tag             = 'v1',
    [string]$CosmosAccount   = 'aid-rag-search-cosmosdb',
    [string]$AppName         = 'aid-api-rag',
    [string]$Environment     = 'aid-rag-env',
    [string]$Location        = 'westeurope',
    # Skip the image build when only the app configuration changed.
    [switch]$SkipBuild,
    # Enable the Cosmos capabilities and stop. Run this first on a new account:
    # scripts/provision.py and scripts/ingest.py both need the capabilities in
    # place, and there is no reason to wait 15 minutes for an image build before
    # finding out whether the data layer works.
    [switch]$CapabilitiesOnly
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path $PSScriptRoot -Parent

# Azure CLI is often missing from PATH in a shell opened before it was
# installed, so fall back to the standard install location.
$az = (Get-Command az -ErrorAction SilentlyContinue).Source
if (-not $az) { $az = 'C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin\az.cmd' }
if (-not (Test-Path $az)) { throw 'Azure CLI not found. Install it, then reopen the terminal.' }

# Deliberately NOT an advanced function. With [CmdletBinding] or a
# ValueFromRemainingArguments parameter, PowerShell tries to bind `-o` to the
# common parameters -OutVariable/-OutBuffer and fails with "the parameter name
# 'o' is ambiguous". A bare $args function does no binding at all, so az flags
# pass through untouched.
function Invoke-Az {
    $output = & $az @args
    if ($LASTEXITCODE -ne 0) { throw "az $($args -join ' ') failed:`n$output" }
    return $output
}

function Write-Step { param([string]$Message) Write-Host "==> $Message" -ForegroundColor Cyan }

# ---------------------------------------------------------------------------
# Read secrets from .env
# ---------------------------------------------------------------------------
$envPath = Join-Path $repoRoot '.env'
if (-not (Test-Path $envPath)) { throw ".env not found at $envPath. Copy .env.example and fill it in." }

$envVars = @{}
foreach ($line in Get-Content $envPath) {
    $trimmed = $line.Trim()
    if (-not $trimmed -or $trimmed.StartsWith('#')) { continue }
    $split = $trimmed.IndexOf('=')
    if ($split -lt 1) { continue }
    # Values are taken verbatim after the first '=' — Azure keys are base64 and
    # contain '=' padding, so splitting on every '=' would corrupt them.
    $envVars[$trimmed.Substring(0, $split).Trim()] = $trimmed.Substring($split + 1).Trim()
}

foreach ($required in 'OPENAI_API_KEY', 'BACKEND_API_KEY', 'COSMOS_ENDPOINT', 'COSMOS_KEY', 'AZURE_STORAGE_ACCOUNT', 'AZURE_STORAGE_KEY') {
    if (-not $envVars[$required]) { throw "$required is missing or empty in .env" }
}

# ---------------------------------------------------------------------------
# 0. Confirm which subscription we are about to change
# ---------------------------------------------------------------------------
$account = Invoke-Az account show -o json | ConvertFrom-Json
Write-Host "subscription      $($account.name)  ($($account.id))" -ForegroundColor Yellow
Write-Host "signed in as      $($account.user.name)" -ForegroundColor Yellow
Write-Host "resource group    $ResourceGroup" -ForegroundColor Yellow
Write-Host ''

Invoke-Az group show --name $ResourceGroup -o none

# The containerapp commands live in an extension that is not installed by
# default, and the providers are not registered on a subscription that has never
# run Container Apps.
Write-Step 'Ensuring the containerapp extension and resource providers are present'
& $az extension add --name containerapp --upgrade --only-show-errors 2>$null

# Registering a provider is a SUBSCRIPTION-scope action. In a governed landing
# zone you may only hold Contributor on the resource group, in which case this
# returns AuthorizationFailed. That does not block Cosmos, storage or the image
# build — all of which are resource-group scope — so warn and carry on, and let
# the environment/app step fail with a specific message if it comes to that.
function Get-ProviderState {
    param([string]$Namespace)
    $state = & $az provider show --namespace $Namespace --query registrationState -o tsv 2>$null
    if ($LASTEXITCODE -ne 0) { return 'Unknown' }
    return $state
}

$providerBlocked = @()
foreach ($namespace in 'Microsoft.App', 'Microsoft.OperationalInsights') {
    $state = Get-ProviderState $namespace
    if ($state -eq 'Registered') {
        Write-Host "  $namespace  Registered" -ForegroundColor Green
        continue
    }
    Write-Host "  $namespace  $state - attempting to register" -ForegroundColor Yellow
    & $az provider register --namespace $namespace --wait 2>$null
    if ($LASTEXITCODE -ne 0) {
        $providerBlocked += $namespace
        Write-Host "  $namespace  cannot register (no subscription-scope rights)" -ForegroundColor Red
    } else {
        Write-Host "  $namespace  Registered" -ForegroundColor Green
    }
}

# ---------------------------------------------------------------------------
# 1. Cosmos capabilities
# ---------------------------------------------------------------------------
# Hybrid search needs both a vector policy and a full-text policy on the chunk
# container, and each is gated behind an account capability. Without them
# scripts/provision.py fails with "the capability has not been enabled on your
# account". `az cosmosdb update --capabilities` REPLACES the list, so existing
# capabilities (notably EnableServerless, which cannot be re-added later) are
# merged in rather than overwritten.
Write-Step "Checking Cosmos capabilities on $CosmosAccount"
$cosmos = Invoke-Az cosmosdb show --name $CosmosAccount --resource-group $ResourceGroup -o json | ConvertFrom-Json
$current = @($cosmos.capabilities | ForEach-Object { $_.name })
Write-Host "  current: $(if ($current) { $current -join ', ' } else { '(none)' })"

$wanted = @('EnableNoSQLVectorSearch', 'EnableNoSQLFullTextSearchPreviewFeatures')
$missing = $wanted | Where-Object { $_ -notin $current }

if ($missing) {
    $merged = @($current + $missing | Select-Object -Unique)
    Write-Host "  adding:  $($missing -join ', ')" -ForegroundColor Yellow
    Invoke-Az cosmosdb update --name $CosmosAccount --resource-group $ResourceGroup --capabilities @merged -o none
    Write-Host '  enabled. Propagation takes a minute or two.' -ForegroundColor Green
} else {
    Write-Host '  both already enabled.' -ForegroundColor Green
}

if ($CapabilitiesOnly) {
    Write-Host ''
    Write-Host 'Capabilities done. Next:' -ForegroundColor Cyan
    Write-Host '  python scripts\provision.py'
    Write-Host '  python scripts\ingest.py'
    Write-Host '  powershell -ExecutionPolicy Bypass -File scripts\azure_deploy.ps1'
    return
}

# ---------------------------------------------------------------------------
# 2. Build the image in Azure
# ---------------------------------------------------------------------------
$fullTag = "$Registry.azurecr.io/$Image`:$Tag"

if ($SkipBuild) {
    Write-Step "Skipping build; expecting $fullTag to exist already"
} else {
    # ACR Tasks was blocked on the old Azure for Students subscription
    # (TasksOperationsNotAllowed), which is why scripts\build_and_push.ps1
    # exists. On a pay-as-you-go subscription this builds server-side instead,
    # so there is no Docker Desktop dependency and no multi-GB upload — only
    # the build context goes up.
    Write-Step "Building $fullTag in Azure (~15 min for the first build)"
    Push-Location $repoRoot
    try {
        & $az acr build --registry $Registry --image "$Image`:$Tag" --platform linux/amd64 .
        if ($LASTEXITCODE -ne 0) {
            throw @"
az acr build failed.

If the error is TasksOperationsNotAllowed, ACR Tasks is not permitted on this
subscription and the image has to be built locally instead:

    powershell -ExecutionPolicy Bypass -File scripts\build_and_push.ps1 -Registry $Registry

Then re-run this script with -SkipBuild.
"@
        }
    } finally {
        Pop-Location
    }
}

# ---------------------------------------------------------------------------
# 3. Managed environment
# ---------------------------------------------------------------------------
# Everything above this line works with Contributor on the resource group.
# Container Apps additionally needs the providers registered subscription-wide,
# which is not something resource-group Contributor can do.
if ($providerBlocked) {
    throw @"
Cannot create Container Apps resources: $($providerBlocked -join ', ') is not
registered on subscription '$($account.name)', and this account only has rights
on the resource group, not the subscription.

Everything else is already done — Cosmos, storage and the image in $Registry are
ready. Only the Container App is missing.

Ask a subscription Owner/Contributor to run:

    az account set --subscription $($account.id)
    az provider register --namespace Microsoft.App --wait
    az provider register --namespace Microsoft.OperationalInsights --wait

Then re-run this script with -SkipBuild to create the app without rebuilding:

    powershell -ExecutionPolicy Bypass -File scripts\azure_deploy.ps1 -SkipBuild
"@
}

Write-Step "Ensuring Container Apps environment $Environment in $Location"
$envExists = & $az containerapp env show --name $Environment --resource-group $ResourceGroup -o tsv --query name 2>$null
if ($LASTEXITCODE -ne 0 -or -not $envExists) {
    Invoke-Az containerapp env create --name $Environment --resource-group $ResourceGroup --location $Location -o none
    Write-Host "  created $Environment" -ForegroundColor Green
} else {
    Write-Host "  $Environment already exists" -ForegroundColor Green
}

# ---------------------------------------------------------------------------
# 4. Container App
# ---------------------------------------------------------------------------
# Admin credentials rather than managed identity: assigning AcrPull to a
# system-assigned identity needs role-assignment rights on the subscription,
# which a plain Contributor does not have. See DEPLOY.md for the identity
# variant if you would rather not enable the admin user.
Write-Step "Enabling the admin user on $Registry so the app can pull"
Invoke-Az acr update --name $Registry --admin-enabled true -o none
$acrPassword = Invoke-Az acr credential show --name $Registry --query 'passwords[0].value' -o tsv

# secretref: indirection keeps these out of `az containerapp show` output and
# out of the revision's plain env vars.
$secretArgs = @(
    "openai-key=$($envVars['OPENAI_API_KEY'])"
    "cosmos-key=$($envVars['COSMOS_KEY'])"
    "storage-key=$($envVars['AZURE_STORAGE_KEY'])"
    "backend-api-key=$($envVars['BACKEND_API_KEY'])"
)

$envArgs = @(
    'OPENAI_API_KEY=secretref:openai-key'
    'COSMOS_KEY=secretref:cosmos-key'
    'AZURE_STORAGE_KEY=secretref:storage-key'
    'BACKEND_API_KEY=secretref:backend-api-key'
    "OPENAI_MODEL=$(if ($envVars['OPENAI_MODEL']) { $envVars['OPENAI_MODEL'] } else { 'gpt-5.4-nano' })"
    "COSMOS_ENDPOINT=$($envVars['COSMOS_ENDPOINT'])"
    "COSMOS_DATABASE=$(if ($envVars['COSMOS_DATABASE']) { $envVars['COSMOS_DATABASE'] } else { 'RagDB' })"
    "COSMOS_CHUNKS_CONTAINER=$(if ($envVars['COSMOS_CHUNKS_CONTAINER']) { $envVars['COSMOS_CHUNKS_CONTAINER'] } else { 'KnowledgeBase' })"
    "COSMOS_DOCUMENTS_CONTAINER=$(if ($envVars['COSMOS_DOCUMENTS_CONTAINER']) { $envVars['COSMOS_DOCUMENTS_CONTAINER'] } else { 'documents' })"
    "COSMOS_RESEARCHERS_CONTAINER=$(if ($envVars['COSMOS_RESEARCHERS_CONTAINER']) { $envVars['COSMOS_RESEARCHERS_CONTAINER'] } else { 'researchers' })"
    "AZURE_STORAGE_ACCOUNT=$($envVars['AZURE_STORAGE_ACCOUNT'])"
    "AZURE_BLOB_CONTAINER=$(if ($envVars['AZURE_BLOB_CONTAINER']) { $envVars['AZURE_BLOB_CONTAINER'] } else { 'documents' })"
)

# Three settings are easy to get wrong and each fails quietly:
#   --target-port 8000  uvicorn's port; the ACA default of 80 drops all traffic
#   --min-replicas 1    scale-to-zero means a cold start reloads a 420 MB model
#   --memory 4Gi        torch plus the model do not fit in less
$appExists = & $az containerapp show --name $AppName --resource-group $ResourceGroup -o tsv --query name 2>$null
if ($LASTEXITCODE -ne 0 -or -not $appExists) {
    Write-Step "Creating Container App $AppName"
    Invoke-Az containerapp create `
        --name $AppName --resource-group $ResourceGroup --environment $Environment `
        --image $fullTag `
        --registry-server "$Registry.azurecr.io" --registry-username $Registry --registry-password $acrPassword `
        --cpu 2 --memory 4Gi --min-replicas 1 --max-replicas 3 `
        --ingress external --target-port 8000 --transport auto `
        --secrets @secretArgs --env-vars @envArgs -o none
} else {
    Write-Step "Updating existing Container App $AppName"
    Invoke-Az containerapp registry set --name $AppName --resource-group $ResourceGroup `
        --server "$Registry.azurecr.io" --username $Registry --password $acrPassword -o none
    Invoke-Az containerapp secret set --name $AppName --resource-group $ResourceGroup --secrets @secretArgs -o none
    Invoke-Az containerapp update --name $AppName --resource-group $ResourceGroup `
        --image $fullTag --cpu 2 --memory 4Gi --min-replicas 1 --max-replicas 3 `
        --set-env-vars @envArgs -o none
    Invoke-Az containerapp ingress enable --name $AppName --resource-group $ResourceGroup `
        --type external --target-port 8000 --transport auto -o none
}

$fqdn = Invoke-Az containerapp show --name $AppName --resource-group $ResourceGroup `
    --query 'properties.configuration.ingress.fqdn' -o tsv

Write-Host ''
Write-Host "==> Deployed: https://$fqdn" -ForegroundColor Green
Write-Host ''
Write-Host 'Next:' -ForegroundColor Cyan
Write-Host "  python scripts\smoke_test.py --url https://$fqdn"
Write-Host ''
Write-Host 'Then set this FQDN in the frontend (aiD-space src/routes/chat/+server.ts).'
