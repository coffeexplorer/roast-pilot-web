@echo off
echo ================================
echo 🚀 Roast Pilot SAFE Auto Deploy
echo ================================

cd /d C:\Users\coffe\Desktop\Smart\roast-pilot-web

echo.
echo 🔎 Git status
git status

echo.
echo 📌 Adding changes
git add .

echo.
echo 💬 Committing
git commit -m "auto deploy"

echo.
echo 🧪 Running LOCAL BUILD CHECK...
call npm run build

IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ BUILD FAILED. DEPLOY CANCELLED.
    pause
    exit /b 1
)

echo.
echo ⬆ Pushing to GitHub
git push

echo.
echo 🌐 Deploying on Server
ssh rp "bash ~/deploy-web.sh"

echo.
echo ================================
echo ✅ SAFE DEPLOY COMPLETE
echo ================================
pause