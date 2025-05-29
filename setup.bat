@echo off
echo Starting Precast Concrete Management System setup...

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
echo Installing dependencies...
"%NODE_PATH%\node.exe" "%NODE_PATH%\node_modules\npm\bin\npm-cli.js" install
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to install dependencies.
    pause
    exit /b 1
)

echo.
echo Generating Prisma client...
"%NODE_PATH%\node.exe" "%NODE_PATH%\node_modules\npx\npx-cli.js" prisma generate
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to generate Prisma client.
    pause
    exit /b 1
)

echo.
echo Setup completed successfully!
echo To start the application, run start.bat
echo.

pause
