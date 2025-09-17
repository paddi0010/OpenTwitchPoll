@echo off
echo ===============================
echo  Starte OpenTwitchPoll Bot
echo ===============================

REM Prüfen, ob node_modules vorhanden ist
IF NOT EXIST node_modules (
  echo Installiere Abhängigkeiten...
  call npm install
  if %errorlevel% neq 0 (
    echo Fehler bei der Installation der Pakete!
    pause
    exit /b
  )
  echo Installation abgeschlossen!
)

REM Bot starten
echo Starte Bot...
node start.js

echo.
echo Bot wurde beendet.
pause
