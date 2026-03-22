@echo off
REM Quick Start Script for Adaptive Question System
REM This script sets up and starts both backend and frontend

echo.
echo ============================================
echo Adaptive Practice & Question Generation System
echo Quick Start Script
echo ============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js 14+ from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Python found: %python --version%
echo [OK] Node.js found: %node --version%
echo.

REM Setup Backend
echo ============================================
echo Setting up BACKEND...
echo ============================================
cd backend

REM Create virtual environment
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install backend dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Start backend in new window
echo.
echo [OK] Backend setup complete!
echo Starting backend server on port 8000...
echo.
start "Backend Server" cmd /k "python main.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Setup Frontend
echo.
echo ============================================
echo Setting up FRONTEND...
echo ============================================
cd ..\frontend

REM Check if node_modules exists
if not exist node_modules (
    echo Installing React dependencies (this may take a few minutes)...
    call npm install
)

REM Start frontend in new window
echo.
echo [OK] Frontend setup complete!
echo Starting frontend server on port 3000...
echo.
start "Frontend Server" cmd /k "npm start"

echo.
echo ============================================
echo STARTUP COMPLETE!
echo ============================================
echo.
echo Backend URL:  http://localhost:8000
echo Frontend URL: http://localhost:3000
echo.
echo The frontend should open automatically in your browser.
echo If not, manually open: http://localhost:3000
echo.
echo Press any key to continue...
pause
