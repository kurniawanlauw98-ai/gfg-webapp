@echo off
echo ========================================
echo   GFG - Generation for God
echo   Starting Application...
echo ========================================
echo.

echo Starting Backend Server...
start cmd /k "cd server && npm start"

timeout /t 3 /nobreak > nul

echo Starting Frontend Dev Server...
start cmd /k "cd client && npm run dev"

echo.
echo ========================================
echo   Application Started!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul
