@echo off
echo Starting Precast Concrete Management System...

rem Set up the portable Node.js environment
set NODE_PATH=%~dp0portable-node
set PATH=%NODE_PATH%;%NODE_PATH%\node_modules\.bin;%PATH%

rem Check if portable Node.js exists
if not exist "%NODE_PATH%\node.exe" (
    echo Error: Portable Node.js not found at %NODE_PATH%
    echo Please ensure the portable-node folder is in the same directory as this batch file.
    pause
    exit /b 1
)

echo Using portable Node.js from: %NODE_PATH%
"%NODE_PATH%\node.exe" --version

echo.
echo Starting development server...
echo The application will be available at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

"%NODE_PATH%\node.exe" "%NODE_PATH%\node_modules\npm\bin\npm-cli.js" run dev

pause
