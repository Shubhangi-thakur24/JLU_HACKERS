@echo off
REM Git Deployment Script for JLU_HACKERS
REM This script will push your project to GitHub

echo.
echo ============================================
echo Git Deployment Script - JLU_HACKERS
echo ============================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in PATH
    echo Please download and install Git from: https://git-scm.com/download/win
    echo After installation, restart PowerShell and run this script again.
    pause
    exit /b 1
)

echo [OK] Git found: 
git --version

echo.
echo ============================================
echo Step 1: Initialize Repository
echo ============================================
cd /d "c:\Users\LENOVO\Desktop\aditya project sql\DevClash"
git init

echo.
echo ============================================
echo Step 2: Configure Git User (Optional)
echo ============================================
echo If you want to configure your Git user, enter:
echo git config user.email "your.email@github.com"
echo git config user.name "Your Name"
echo.

echo.
echo ============================================
echo Step 3: Add All Files
echo ============================================
git add .
echo [OK] Files staged for commit

echo.
echo ============================================
echo Step 4: Create Initial Commit
echo ============================================
git commit -m "Initial commit: Adaptive Practice & Question Generation System - Full-stack learning platform"
echo [OK] Commit created

echo.
echo ============================================
echo Step 5: Ensure Main Branch
echo ============================================
git branch -M main
echo [OK] Branch set to main

echo.
echo ============================================
echo Step 6: Add GitHub Remote
echo ============================================
git remote add origin https://github.com/Shubhangi-thakur24/JLU_HACKERS.git
echo [OK] GitHub remote configured

echo.
echo ============================================
echo Step 7: Push to GitHub
echo ============================================
echo You will be asked for your GitHub credentials.
echo Use your GitHub username and Personal Access Token (not your password).
echo.
echo Create a token at: https://github.com/settings/tokens
echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ============================================
echo DEPLOYMENT STATUS
echo ============================================
if %errorlevel% equ 0 (
    echo [SUCCESS] Project pushed to GitHub!
    echo Repository: https://github.com/Shubhangi-thakur24/JLU_HACKERS
) else (
    echo [ERROR] Push failed. Check error messages above.
)

echo.
pause
