@echo off
echo.
echo ========================================
echo  HOLOGRAPHIC WALLPAPER PRO
echo  Advanced Visual Editor
echo ========================================
echo.
echo Starting local server...
echo Open your browser to: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"
python -m http.server 8080
pause