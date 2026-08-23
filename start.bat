@echo off
echo Starting SafeAura Women Threat Detection System...
echo.

echo [1/2] Starting Flask backend on http://localhost:5000
echo       (To auto-play a video: python app.py --input myvideo.mp4)
start "SafeAura Backend" cmd /k "cd /d "%~dp0backend" && python app.py %*"

timeout /t 2 /nobreak >nul

echo [2/2] Starting React frontend on http://localhost:5173
start "SafeAura Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both servers starting...
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo To train the model first, run:
echo   cd backend
echo   python train.py
pause
