package ch.maecefischer.todo_app.api_backend.api

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.time.Instant
import java.util.Optional
import java.util.UUID

data class Todo(
    val id: UUID = UUID.randomUUID(),
    val title: String,
    val description: String? = null,
    val isDone: Boolean = false,
    val createdAt: Instant = Instant.now(),
)

data class TodoCreationData(
    val title: String,
    val isDone: Boolean? = false,
) {
    fun toTodo(): Todo {
        return Todo(
            title = this.title,
            isDone = this.isDone ?: false,
        )
    }
}

data class TodoUpdateData(
    val title: String?,
    val isDone: Boolean?,
    val description: Optional<String?>,
) {
    fun toUpdatedTodo(todo: Todo): Todo {
        return todo.copy(
            title = this.title ?: todo.title,
            isDone = this.isDone ?: todo.isDone,
            description = if (description.isPresent) description.get() else todo.description,
        )
    }
}

@RestController
@RequestMapping("/api/v1/todos")
class TodoController {
    val todos = mutableListOf(
        Todo(title = "Create an OAS3 to TS with Zod generator", isDone = true),
        Todo(title = "Learn Spring Boot", isDone = false),
        Todo(title = "Do some Kotlin tutorials", isDone = false),
        Todo(title = "Go to Kickboxing morning session", isDone = false),
        Todo(title = "Explain to neighbours that you're not the \"PC Support guy\"", isDone = false),
    )

    @GetMapping
    fun todos(): MutableList<Todo> = todos

    @PostMapping("/")
    fun createTodo(@RequestBody data: TodoCreationData): Todo {
        val newTodo = data.toTodo()
        todos.add(newTodo)
        return newTodo
    }

    @PatchMapping("/{id}")
    fun updateTodo(
        @RequestBody data: TodoUpdateData,
        @PathVariable id: UUID,
    ): Todo {
        val todoIndex = todos.indexOfFirst { it.id == id }
        if (todoIndex == - 1) throw ResponseStatusException(HttpStatus.NOT_FOUND)
        val updatedTodo = data.toUpdatedTodo(todos[todoIndex])
        todos.add(todoIndex, updatedTodo)
        return updatedTodo
    }

    @DeleteMapping("/{id}")
    fun removeTodo(@PathVariable id: UUID) {
        todos.removeIf { it.id == id }
    }
}