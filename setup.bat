@echo off
echo ========================================
echo   GFG - Generation for God Setup
echo ========================================
echo.

echo [1/3] Installing Backend Dependencies...
cd server
call npm install
echo.

echo [2/3] Installing Frontend Dependencies...
cd ..\client
call npm install
echo.

echo [3/3] Creating Admin Account...
cd ..\server
call npm run seed-admin
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Edit server/.env and set your MONGO_URI
echo 2. Run start.bat to launch the application
echo.
pause
