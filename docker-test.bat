@echo off
echo Testing Docker Setup...
echo.

echo 1. Checking Docker installation...
docker --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker is not installed or not running!
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    exit /b 1
)
echo.

echo 2. Checking Docker Compose...
docker compose version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker Compose is not available!
    exit /b 1
)
echo.

echo 3. Building Docker image...
docker build -t todo-management .
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker build failed!
    exit /b 1
)
echo.

echo 4. Testing production container...
echo Starting container...
docker run -d -p 3000:3000 --name todo-test todo-management
timeout /t 10 /nobreak
echo Testing application access...
curl -s http://localhost:3000 > nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Application is not accessible!
    echo Checking container logs:
    docker logs todo-test
) else (
    echo Application is accessible at http://localhost:3000
)
echo.

echo 5. Cleaning up test container...
docker stop todo-test
docker rm todo-test
echo.

echo 6. Testing development environment...
echo Starting Docker Compose...
docker compose up -d
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker Compose failed to start!
    exit /b 1
)
timeout /t 10 /nobreak
echo Testing dev server access...
curl -s http://localhost:3000 > nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Development server is not accessible!
    echo Checking logs:
    docker compose logs
) else (
    echo Development server is accessible at http://localhost:3000
)
echo.

echo 7. Cleaning up development environment...
docker compose down
echo.

echo All tests completed!
echo.
echo Next steps:
echo 1. Check if any errors were reported above
echo 2. Verify the application manually at http://localhost:3000
echo 3. Test hot reload in development mode
echo 4. Check container logs for any warnings 