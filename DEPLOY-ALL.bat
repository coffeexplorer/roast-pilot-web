@echo off
echo ================================
echo 🚀 Roast Pilot Auto Deploy
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
echo ⬆ Pushing to GitHub
git push

echo.
echo 🌐 Deploying on Server
ssh rp "bash ~/deploy-web.sh"

echo.
echo ================================
echo ✅ DEPLOY COMPLETE
echo ================================
pause