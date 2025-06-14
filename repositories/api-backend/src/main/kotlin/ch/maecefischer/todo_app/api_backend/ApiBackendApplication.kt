package ch.maecefischer.todo_app.api_backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class ApiBackendApplication

fun main(args: Array<String>) {
	runApplication<ApiBackendApplication>(*args)
}
