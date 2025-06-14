# Service orchestration

This is about orchestrating all services for a todo app demo using containerization
with [Docker](https://www.docker.com/). This is done by integrating separated frontend and backend services:
- api-backend: A Spring Boot JSON API, written in Kotlin
- db: A MariaDB database service to store data which was processed from the api-backend service
- web-frontend: A web frontend, written in React and Next.js