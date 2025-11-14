@echo off
echo ==========================================
echo  XHS Content Matrix - 开发环境启动脚本
echo ==========================================
echo.

echo [1/4] 检查依赖包...
cd backend
if not exist node_modules (
    echo 正在安装后端依赖...
    npm install
)

cd ../frontend
if not exist node_modules (
    echo 正在安装前端依赖...
    npm install
)

echo.
echo [2/4] 启动后端服务...
cd ../backend
start "XHS Backend" cmd /k "npm run dev"

timeout /t 3

echo [3/4] 启动前端服务...
cd ../frontend
start "XHS cd Frontend" cmd /k "npm run dev"

echo.
echo [4/4] 完成！
echo.
echo 🚀 服务启动成功！
echo 📡 前端地址: http://localhost:5173
echo 📡 后端地址: http://localhost:3002
echo 🤖 AI模型: DeepSeek-v3.1
echo.
echo 按任意键关闭此窗口...
pause >nul
