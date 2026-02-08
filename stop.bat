@echo off
color 0C
title Maxed-CV Shutdown

echo.
echo  ╔════════════════════════════════════════════════════════════╗
echo  ║                  MAXED-CV SHUTDOWN SCRIPT                  ║
echo  ╚════════════════════════════════════════════════════════════╝
echo.
echo  Stopping all services...
echo  ──────────────────────────────────────────────────────────────
echo.

docker-compose down

echo.
echo  ╔════════════════════════════════════════════════════════════╗
echo  ║            ALL SERVICES STOPPED SUCCESSFULLY!              ║
echo  ╚════════════════════════════════════════════════════════════╝
echo.
echo  All containers have been stopped and removed.
echo.
pause
