@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Демо-бот Telegram
if not exist ".env" (
  copy ".env.example" ".env" >nul
  echo.
  echo  Создал файл .env - впишите в него токен бота после BOT_TOKEN= и сохраните.
  echo  Потом снова запустите ЗАПУСК.bat
  echo.
  notepad ".env"
  pause
  exit /b
)
node bot.js
pause
