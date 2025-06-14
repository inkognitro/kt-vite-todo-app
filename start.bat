@echo off

echo Starting Docker containers...
docker-compose -f docker-compose.yml -p todo-app-services up

echo Services have stopped.
pause