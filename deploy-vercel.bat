@echo off
echo 🚀 Preparing for Vercel Deployment...
echo.

echo 📦 Installing dependencies...
call npm install

echo.
echo 🔨 Building application...
call npm run build

echo.
echo ✅ Build completed successfully!
echo.
echo 🌐 Ready for deployment to Vercel!
echo.
echo 📋 Next steps:
echo 1. Push your code to GitHub
echo 2. Connect your repository to Vercel
echo 3. Set environment variables in Vercel dashboard
echo 4. Deploy!
echo.
echo 💡 Environment variables needed:
echo    NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
echo.
pause
