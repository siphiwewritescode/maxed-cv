@echo off
setlocal enabledelayedexpansion
color 0A
title Maxed-CV Startup

echo.
echo  ╔════════════════════════════════════════════════════════════╗
echo  ║                  MAXED-CV STARTUP SCRIPT                   ║
echo  ╚════════════════════════════════════════════════════════════╝
echo.

REM ===== STEP 1: Check Docker =====
echo  [STEP 1/5] Checking Docker Desktop status...
echo  ──────────────────────────────────────────────────────────────

docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo  ^> Docker Desktop is not running
    echo  ^> Starting Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo.
    echo  ^> Waiting for Docker Desktop to start...
    echo.

    REM Wait for Docker to be ready (max 60 seconds)
    set /a counter=0
    :waitloop
    timeout /t 2 /nobreak >nul
    set /a counter+=2
    echo     ... checking Docker status [!counter!/60 seconds]
    docker info >nul 2>&1
    if %errorlevel% equ 0 goto dockerready
    if !counter! lss 60 goto waitloop

    echo.
    echo  X ERROR: Docker Desktop failed to start within 60 seconds
    echo  X Please start Docker Desktop manually and try again
    echo.
    pause
    exit /b 1
)

:dockerready
echo  + Docker Desktop is running!
echo.

REM ===== STEP 2: Start Containers =====
echo  [STEP 2/5] Starting Docker containers...
echo  ──────────────────────────────────────────────────────────────
docker-compose up -d
if %errorlevel% neq 0 (
    echo.
    echo  X ERROR: Failed to start containers
    pause
    exit /b 1
)
echo  + Containers started successfully!
echo.

REM ===== STEP 3: Wait for Database =====
echo  [STEP 3/5] Waiting for database initialization...
echo  ──────────────────────────────────────────────────────────────
set /a counter=0
:dbwait
timeout /t 1 /nobreak >nul
set /a counter+=1
echo     ... initializing [!counter!/5 seconds]
if !counter! lss 5 goto dbwait
echo  + Database ready!
echo.

REM ===== STEP 4: Wait for Backend =====
echo  [STEP 4/5] Waiting for backend health check...
echo  ──────────────────────────────────────────────────────────────
set /a counter=0
:healthcheck
timeout /t 2 /nobreak >nul
set /a counter+=1
echo     ... health check attempt !counter!/30
curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% equ 0 goto servicesready
if !counter! lss 30 goto healthcheck

echo.
echo  ! WARNING: Backend health check timeout, but continuing anyway...
goto afterhealth

:servicesready
echo  + Backend is healthy!

:afterhealth
echo.

REM ===== STEP 5: Open Browser =====
echo  [STEP 5/5] Opening browser...
echo  ──────────────────────────────────────────────────────────────
start http://localhost:3000/login
timeout /t 2 /nobreak >nul
echo  + Browser opened!
echo.
echo.

REM ===== Success Message =====
echo  ╔════════════════════════════════════════════════════════════╗
echo  ║              ALL SERVICES RUNNING SUCCESSFULLY!            ║
echo  ╚════════════════════════════════════════════════════════════╝
echo.
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:3001
echo   Database:  postgresql://localhost:5432/maxedcv
echo   Redis:     redis://localhost:6379
echo.
echo  ──────────────────────────────────────────────────────────────
echo.
echo  Press any key to view live logs (Ctrl+C to stop viewing)
echo.
pause >nul

cls
echo.
echo  ╔════════════════════════════════════════════════════════════╗
echo  ║                    LIVE APPLICATION LOGS                   ║
echo  ╚════════════════════════════════════════════════════════════╝
echo.
echo  Press Ctrl+C to exit logs (containers will keep running)
echo.
echo  ──────────────────────────────────────────────────────────────
echo.

docker-compose logs -f
