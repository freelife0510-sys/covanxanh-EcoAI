@echo off
title EcoAI - Dong bo GitHub va Vercel
chcp 65001 >nul
cls

echo =========================================================================
echo   ECOAI - CONG CU DONG BO GITHUB VA TRIEN KHAI VERCEL
echo   Tac gia / Ban De tai: Thay Ho Sy Long
echo =========================================================================
echo.

set "PATH=C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;%PATH%"

echo [1/3] Kiem tra Git va GitHub CLI...
git --version
if %errorlevel% neq 0 (
    echo [LOI] Khong tim thay Git.
    pause
    exit /b
)

gh --version >nul 2>nul
if %errorlevel% neq 0 (
    echo [LOI] Khong tim thay GitHub CLI.
    pause
    exit /b
)
echo [OK] Git va GitHub CLI da san sang!
echo.

echo [2/3] Kiem tra dang nhap GitHub...
gh auth status >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo Ban chua dang nhap GitHub tren may tinh nay.
    echo Dang mo trinh duyet de ban dang nhap GitHub trong 3 giay...
    gh auth login --web -p https
) else (
    echo [OK] Ban da dang nhap GitHub thanh cong!
)

echo.
echo [3/3] Day ma nguon len GitHub...
echo Kiem tra remote origin...
git remote get-url origin >nul 2>nul
if %errorlevel% neq 0 (
    echo Dang tu dong tao Repository moi tren GitHub (EcoAI-Hub)...
    gh repo create EcoAI-Hub --public --source=. --remote=origin --push
) else (
    echo Remote origin da ton tai, dang day commit moi...
    git push -u origin main
)

echo.
echo =========================================================================
echo   CHUC MUNG! MA NGUON ECOAI DA DUOC DONG BO LEN GITHUB!
echo =========================================================================
echo.
echo Buoc tiep theo: Trien khai len Vercel (chi mat 1 phut):
echo 1. Truy cap: https://vercel.com/new
echo 2. Bam nut "Import" canh repository "EcoAI-Hub"
echo 3. Bam nut "Deploy" - Vercel se tu dong build va cap domain mien phi!
echo.
pause
