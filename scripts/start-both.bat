@echo off
REM TripDekho Platform - Windows Startup Script
REM This script starts both backend and frontend applications

setlocal enabledelayedexpansion

REM Colors aren't natively supported in Windows CMD, so we'll use PowerShell
REM Check if Node.js is installed
where /q node
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

REM Get mode from argument (dev, prod, test)
set MODE=dev
if not "%1"=="" set MODE=%1

REM Resolve absolute paths
cd /d "%~dp0\.."
set PROJECT_ROOT=%cd%
set BACKEND_PATH=%PROJECT_ROOT%\backend
set FRONTEND_PATH=%PROJECT_ROOT%\frontend

echo.
echo ========================================
echo   TripDekho Platform - Startup Manager
echo ========================================
echo.
echo Mode: %MODE%
echo Project Root: %PROJECT_ROOT%
echo.

REM Check if directories exist
if not exist "%BACKEND_PATH%" (
    echo [ERROR] Backend directory not found: %BACKEND_PATH%
    exit /b 1
)

if not exist "%FRONTEND_PATH%" (
    echo [ERROR] Frontend directory not found: %FRONTEND_PATH%
    exit /b 1
)

REM Check .env files
if not exist "%BACKEND_PATH%\.env" (
    echo [WARNING] Backend .env file not found at %BACKEND_PATH%\.env
)

if not exist "%FRONTEND_PATH%\.env.local" (
    if not exist "%FRONTEND_PATH%\.env" (
        echo [WARNING] Frontend .env file not found at %FRONTEND_PATH%\.env or .env.local
    )
)

REM Check dependencies
echo [INFO] Checking dependencies...

if not exist "%BACKEND_PATH%\node_modules" (
    echo [WARNING] Backend dependencies not installed
    echo [INFO] Installing backend dependencies...
    cd /d "%BACKEND_PATH%"
    call npm install
)

if not exist "%FRONTEND_PATH%\node_modules" (
    echo [WARNING] Frontend dependencies not installed
    echo [INFO] Installing frontend dependencies...
    cd /d "%FRONTEND_PATH%"
    call npm install
)

echo [SUCCESS] Pre-flight checks passed
echo.
echo [INFO] Starting services...
echo.

REM Use PowerShell to run both processes in parallel with colors
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  $backendJob = Start-Job -ScriptBlock { ^
    $ErrorActionPreference = 'Continue'; ^
    cd '%BACKEND_PATH%'; ^
    if ('%MODE%' -eq 'prod') { ^
      npm start; ^
    } else { ^
      npm run dev; ^
    } ^
  } -Name 'backend'; ^
  Start-Sleep -Seconds 3; ^
  $frontendJob = Start-Job -ScriptBlock { ^
    $ErrorActionPreference = 'Continue'; ^
    cd '%FRONTEND_PATH%'; ^
    if ('%MODE%' -eq 'prod') { ^
      npm start; ^
    } else { ^
      npm run dev; ^
    } ^
  } -Name 'frontend'; ^
  Write-Host 'Both services are starting...' -ForegroundColor Green; ^
  Write-Host 'Backend will be available at: http://localhost:5001' -ForegroundColor Cyan; ^
  Write-Host 'Frontend will be available at: http://localhost:3001' -ForegroundColor Cyan; ^
  Write-Host 'Press Ctrl+C to stop all services' -ForegroundColor Yellow; ^
  Get-Job | Wait-Job; ^
  Remove-Job -State Completed

exit /b %errorlevel%
