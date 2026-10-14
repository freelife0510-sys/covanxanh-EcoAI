@echo off
title EcoAI - Co van Xanh (Chay Local)
chcp 65001 >nul
cls
echo =========================================================================
echo   ECOAI - CO VAN XANH (AI-POWERED ECO ACTION HUB THPT)
echo   Tac gia / Lien he: Thay Ho Sy Long - SDT: 0943278804
echo =========================================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [THONG BAO] May tinh cua ban chua cai dat Node.js!
    echo Vui long tai va cai dat Node.js ban LTS tai trang chu: https://nodejs.org
    echo Sau khi cai dat Node.js xong, hay bam dup vao file nay lan nua de chay app.
    echo.
    pause
    exit /b
)

echo [1/3] Kiem tra Node.js: OK!
node -v

if not exist "node_modules\" (
    echo.
    echo [2/3] Dang tu dong cai dat cac thu vien cho ung dung (npm install)...
    echo Xin vui long cho trong 1 - 2 phut cho lan chay dau tien...
    call npm install
    if %errorlevel% neq 0 (
        echo [LOI] Khong the cai dat thu vien. Vui long kiem tra ket noi mang va thu lai.
        pause
        exit /b
    )
) else (
    echo [2/3] Thu vien node_modules da san sang!
)

echo.
echo [3/3] Dang khoi dong may chu EcoAI tai dia chi: http://localhost:3000
echo Trinh duyet web se tu dong mo sau 3 giay...
start http://localhost:3000

echo.
echo =========================================================================
echo   UNG DUNG ECOAI DANG CHAY TAI: http://localhost:3000
echo   De dung may chu, hay nhan to hop phim Ctrl + C trong cua so nay.
echo =========================================================================
echo.

call npm run dev
pause
