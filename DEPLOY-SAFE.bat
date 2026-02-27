@echo off
setlocal

echo ================================
echo 🚀 Roast Pilot FINAL Deploy
echo ================================

cd /d C:\Users\coffe\Desktop\Smart\roast-pilot-web

echo.
set /p MSG=Enter commit message (leave blank for auto): 

if "%MSG%"=="" (
    set MSG=auto deploy
)

echo.
echo 🔎 Git status
git status

echo.
echo 📌 Adding changes
git add .

echo.
echo 💬 Committing
git diff --cached --quiet
if %ERRORLEVEL%==0 (
    echo No changes to commit. Skipping commit.
) else (
    git commit -m "%MSG%"
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Commit failed.
        pause
        exit /b 1
    )
)

echo.
echo 🧪 Running LOCAL BUILD CHECK...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ BUILD FAILED. DEPLOY CANCELLED.
    pause
    exit /b 1
)

echo.
echo ⬆ Pushing to GitHub
git push
if %ERRORLEVEL% NEQ 0 (
    echo ❌ PUSH FAILED.
    pause
    exit /b 1
)

echo.
echo 🌐 Deploying on Server
ssh rp "bash ~/deploy-web.sh"
if %ERRORLEVEL% NEQ 0 (
    echo ❌ SERVER DEPLOY FAILED.
    pause
    exit /b 1
)

echo.
echo ================================
echo ✅ DEPLOY COMPLETE
echo ================================
pause