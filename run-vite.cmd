@echo off
cd /d "%~dp0"
set CI=1
node node_modules\vite\bin\vite.js --host localhost --port 5174
