# TripDekho Platform - PowerShell Startup Script (Windows/Mac/Linux)
# Starts both backend (Node.js) and frontend (Next.js) applications
#
# Usage:
#   ./start-both.ps1
#   ./start-both.ps1 -Mode dev
#   ./start-both.ps1 -Mode prod
#   ./start-both.ps1 -Mode test

param(
    [ValidateSet("dev", "prod", "test")]
    [string]$Mode = "dev"
)

# Colors
$Colors = @{
    Reset   = "`e[0m"
    Bright  = "`e[1m"
    Cyan    = "`e[36m"
    Green   = "`e[32m"
    Yellow  = "`e[33m"
    Red     = "`e[31m"
    Blue    = "`e[34m"
}

# Configuration
$Config = @{
    Backend = @{
        Name       = "Backend API"
        Path       = Join-Path $PSScriptRoot "..\backend"
        Port       = 5001
        DevCmd     = "npm run dev"
        ProdCmd    = "npm start"
        Timeout    = 10000
    }
    Frontend = @{
        Name       = "Frontend App"
        Path       = Join-Path $PSScriptRoot "..\frontend"
        Port       = 3001
        DevCmd     = "npm run dev"
        ProdCmd    = "npm start"
        Timeout    = 15000
    }
}

# Resolve paths
$Config.Backend.Path = (Resolve-Path $Config.Backend.Path).Path
$Config.Frontend.Path = (Resolve-Path $Config.Frontend.Path).Path

# Logging functions
function Write-Log {
    param(
        [string]$Service,
        [string]$Type,
        [string]$Message
    )

    $prefix = "[$Service]"
    $icon = "•"
    $color = $Colors.Reset

    switch ($Type) {
        "info"    { $icon = "[INFO]"; $color = $Colors.Blue }
        "success" { $icon = "[OK]"; $color = $Colors.Green }
        "error"   { $icon = "[FAIL]"; $color = $Colors.Red }
        "warning" { $icon = "[WARN]"; $color = $Colors.Yellow }
        "start"   { $icon = "[START]"; $color = $Colors.Cyan }
        "stop"    { $icon = "[STOP]"; $color = $Colors.Red }
    }

    Write-Host "$color$icon $prefix $Message$($Colors.Reset)"
}

# Check prerequisites
function Test-Prerequisites {
    Write-Log "System" "info" "Running pre-flight checks..."

    # Check Node.js
    try {
        $nodeVersion = node --version
        Write-Log "System" "success" "Node.js $nodeVersion found"
    }
    catch {
        Write-Log "System" "error" "Node.js not found. Please install Node.js from https://nodejs.org/"
        return $false
    }

    # Check npm
    try {
        $npmVersion = npm --version
        Write-Log "System" "success" "npm $npmVersion found"
    }
    catch {
        Write-Log "System" "error" "npm not found"
        return $false
    }

    # Check backend path
    if (-not (Test-Path $Config.Backend.Path)) {
        Write-Log "System" "error" "Backend directory not found: $($Config.Backend.Path)"
        return $false
    }

    # Check frontend path
    if (-not (Test-Path $Config.Frontend.Path)) {
        Write-Log "System" "error" "Frontend directory not found: $($Config.Frontend.Path)"
        return $false
    }

    # Check backend .env
    $backendEnv = Join-Path $Config.Backend.Path ".env"
    if (-not (Test-Path $backendEnv)) {
        Write-Log "System" "warning" "Backend .env not found at $backendEnv"
    }

    # Check dependencies
    $backendNodeModules = Join-Path $Config.Backend.Path "node_modules"
    if (-not (Test-Path $backendNodeModules)) {
        Write-Log "System" "warning" "Backend dependencies not installed"
        Write-Log "System" "info" "Installing backend dependencies..."
        Push-Location $Config.Backend.Path
        npm install | Out-Null
        Pop-Location
        Write-Log "System" "success" "Backend dependencies installed"
    }

    $frontendNodeModules = Join-Path $Config.Frontend.Path "node_modules"
    if (-not (Test-Path $frontendNodeModules)) {
        Write-Log "System" "warning" "Frontend dependencies not installed"
        Write-Log "System" "info" "Installing frontend dependencies..."
        Push-Location $Config.Frontend.Path
        npm install | Out-Null
        Pop-Location
        Write-Log "System" "success" "Frontend dependencies installed"
    }

    return $true
}

# Start service
function Start-Service {
    param(
        [hashtable]$Service
    )

    $cmd = if ($Mode -eq "prod") { $Service.ProdCmd } else { $Service.DevCmd }
    
    Write-Log $Service.Name "start" "Starting in $Mode mode..."
    Write-Log $Service.Name "info" "Command: $cmd"

    $scriptBlock = {
        param($path, $command)
        Push-Location $path
        Invoke-Expression $command
        Pop-Location
    }

    $job = Start-Job -ScriptBlock $scriptBlock -ArgumentList $Service.Path, $cmd

    return $job
}

# Main execution
function Main {
    Write-Host ""
    Write-Host "$($Colors.Bright)$($Colors.Cyan)╔════════════════════════════════════════════════════════════╗$($Colors.Reset)"
    Write-Host "$($Colors.Bright)$($Colors.Cyan)║     TripDekho Platform - Full Stack Startup Manager         ║$($Colors.Reset)"
    Write-Host "$($Colors.Bright)$($Colors.Cyan)╚════════════════════════════════════════════════════════════╝$($Colors.Reset)"
    Write-Host ""

    # Run pre-flight checks
    if (-not (Test-Prerequisites)) {
        Write-Host ""
        Write-Log "System" "error" "Pre-flight checks failed"
        exit 1
    }

    Write-Log "System" "success" "All pre-flight checks passed"
    Write-Log "System" "info" "Starting services in $($Colors.Bright)$Mode$($Colors.Reset) mode"
    Write-Host ""

    # Start services
    Write-Log "System" "info" "Starting backend service..."
    $backendJob = Start-Service $Config.Backend

    Start-Sleep -Seconds 3

    Write-Log "System" "info" "Starting frontend service..."
    $frontendJob = Start-Service $Config.Frontend

    Write-Host ""
    Write-Host "$($Colors.Bright)$($Colors.Green)╔════════════════════════════════════════════════════════════╗$($Colors.Reset)"
    Write-Host "$($Colors.Bright)$($Colors.Green)║          TripDekho Platform is Ready!                      ║$($Colors.Reset)"
    Write-Host "$($Colors.Bright)$($Colors.Green)╚════════════════════════════════════════════════════════════╝$($Colors.Reset)"
    Write-Host ""

    Write-Host "$($Colors.Green)[OK] Backend API$($Colors.Reset)    : http://localhost:$($Config.Backend.Port)"
    Write-Host "$($Colors.Green)[OK] Frontend App$($Colors.Reset)   : http://localhost:$($Config.Frontend.Port)"
    Write-Host "$($Colors.Green)[OK] API Docs$($Colors.Reset)      : http://localhost:$($Config.Backend.Port)/api/v1/docs"
    Write-Host ""

    if ($Mode -eq "dev") {
        Write-Host "$($Colors.Yellow)[INFO] Tips for Development:$($Colors.Reset)"
        Write-Host "   - Backend hot-reloads on file changes (via nodemon)"
        Write-Host "   - Frontend hot-reloads on file changes (via Next.js)"
        Write-Host "   - Check job outputs for any issues"
        Write-Host ""
    }

    # Receive output from jobs
    Write-Log "System" "info" "Receiving output from services..."
    Write-Log "System" "info" "Press Ctrl+C to stop all services"
    Write-Host ""

    try {
        while ($true) {
            $jobs = @($backendJob, $frontendJob)
            
            foreach ($job in $jobs) {
                if ($job.State -eq "Completed" -or $job.State -eq "Failed") {
                    $output = Receive-Job -Job $job
                    if ($output) {
                        Write-Host $output
                    }
                }
            }

            Start-Sleep -Seconds 1
        }
    }
    catch {
        Write-Host ""
        Write-Log "System" "warning" "Stopping services..."
    }
    finally {
        Stop-Job -Job $backendJob
        Stop-Job -Job $frontendJob
        Remove-Job -Job $backendJob
        Remove-Job -Job $frontendJob
        Write-Log "System" "stop" "All services stopped"
    }
}

# Run main function
Main
