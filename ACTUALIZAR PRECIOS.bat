@echo off
title Actualizador de Precios — Ibiza Motos
cd /d "%~dp0"

:: Verificar Python
python --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Python no esta instalado o no esta en el PATH.
    echo Descargalo desde https://www.python.org/downloads/
    pause
    exit /b 1
)

:: Instalar pywin32 si falta
python -c "import win32com.client" >nul 2>&1
if errorlevel 1 (
    echo Instalando libreria requerida ^(pywin32^)...
    pip install pywin32 --quiet
    echo.
)

:: Ejecutar el script con UTF-8
set PYTHONIOENCODING=utf-8
python actualizar_precios.py
