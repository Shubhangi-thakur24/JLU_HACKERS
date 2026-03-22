param(
    [string]$BaseUrl = "http://127.0.0.1:8000",
    [string]$Username = "demo_user",
    [string]$Password = "demo1234"
)

$ErrorActionPreference = "Stop"
$global:Failed = $false

function Run-Step {
    param(
        [string]$Name,
        [scriptblock]$Action
    )

    try {
        & $Action
        Write-Host "[PASS] $Name" -ForegroundColor Green
    }
    catch {
        Write-Host "[FAIL] $Name -> $($_.Exception.Message)" -ForegroundColor Red
        $global:Failed = $true
    }
}

Write-Host "Checking backend at $BaseUrl" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

$pair = "$Username`:$Password"
$encoded = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes($pair))
$headers = @{ Authorization = "Basic $encoded" }

Run-Step "Server reachable" {
    $null = Invoke-RestMethod -Method GET -Uri "$BaseUrl/admin/login/"
}

$script:dashboard = $null
Run-Step "Dashboard endpoint" {
    $script:dashboard = Invoke-RestMethod -Method GET -Uri "$BaseUrl/api/revisions/dashboard/" -Headers $headers
    if (-not $script:dashboard.concepts -or $script:dashboard.concepts.Count -eq 0) {
        $pythonPath = "A:/Spaced repetiton statement 1 backend/.venv/Scripts/python.exe"
        & $pythonPath manage.py shell -c "from django.contrib.auth import get_user_model; from retention_engine.models import Concept; User=get_user_model(); u,_=User.objects.get_or_create(username='demo_user'); u.set_password('demo1234'); u.save(); p,_=Concept.objects.get_or_create(name='Linear Algebra', defaults={'description':'Parent concept'}); c,_=Concept.objects.get_or_create(name='Matrix Multiplication', defaults={'description':'Child concept','parent_concept':p}); c.parent_concept=p; c.save(); print('seeded')"
        $script:dashboard = Invoke-RestMethod -Method GET -Uri "$BaseUrl/api/revisions/dashboard/" -Headers $headers
        if (-not $script:dashboard.concepts -or $script:dashboard.concepts.Count -eq 0) {
            throw "No concepts returned after seeding."
        }
    }
}

if ($script:dashboard -and $script:dashboard.concepts -and $script:dashboard.concepts.Count -gt 0) {
    $conceptId = $script:dashboard.concepts[0].concept_id

    Run-Step "Generate MCQ endpoint" {
        $body = @{ concept_id = $conceptId } | ConvertTo-Json
        $resp = Invoke-RestMethod -Method POST -Uri "$BaseUrl/api/revisions/generate-mcq/" -Headers $headers -ContentType "application/json" -Body $body
        if (-not $resp.llm_prompt) {
            throw "llm_prompt missing."
        }
    }

    Run-Step "Revision log endpoint" {
        $body = @{ concept_id = $conceptId; quality_score = 4 } | ConvertTo-Json
        $resp = Invoke-RestMethod -Method POST -Uri "$BaseUrl/api/revisions/log/" -Headers $headers -ContentType "application/json" -Body $body
        if (-not $resp.message) {
            throw "message missing."
        }
    }
}
else {
    Write-Host "[FAIL] Could not fetch concept_id from dashboard." -ForegroundColor Red
    $global:Failed = $true
}

Run-Step "Simulate day endpoint" {
    $resp = Invoke-RestMethod -Method POST -Uri "$BaseUrl/api/demo/simulate-day/" -Headers $headers -ContentType "application/json" -Body "{}"
    if ($null -eq $resp.records_updated) {
        throw "records_updated missing."
    }
}

if ($global:Failed) {
    Write-Host "Backend check result: FAILED" -ForegroundColor Red
    exit 1
}

Write-Host "Backend check result: ALL TESTS PASSED" -ForegroundColor Green
exit 0
