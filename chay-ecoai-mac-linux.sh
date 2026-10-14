#!/bin/bash
echo "========================================================================="
echo "  ECOAI - CO VAN XANH (AI-POWERED ECO ACTION HUB THPT)"
echo "  Tac gia / Lien he: Thay Ho Sy Long - SDT: 0943278804"
echo "========================================================================="
echo ""

if ! command -v node &> /dev/null; then
    echo "[THONG BAO] May tinh cua ban chua cai dat Node.js!"
    echo "Vui long tai va cai dat Node.js tai: https://nodejs.org"
    exit 1
fi

echo "[1/3] Kiem tra Node.js: OK ($(node -v))"

if [ ! -d "node_modules" ]; then
    echo "[2/3] Dang cai dat cac thu vien (npm install)..."
    npm install
fi

echo "[3/3] Khoi chay EcoAI tai http://localhost:3000 ..."

if command -v open &> /dev/null; then
    open http://localhost:3000 &
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000 &
fi

npm run dev
