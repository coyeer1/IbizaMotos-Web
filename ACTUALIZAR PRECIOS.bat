@echo off
chcp 65001 >nul
title Actualizar precios - Ibiza Motos
cd /d "%~dp0app"
echo.
echo   ACTUALIZAR PRECIOS DE LA WEB DESDE LA LISTA OFICIAL (Google Sheets)
echo   -------------------------------------------------------------------
node scripts\actualizar-precios.mjs
echo.
pause
