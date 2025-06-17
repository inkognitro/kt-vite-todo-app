package ch.maecefischer.todo_app.api_backend.api

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import java.time.Instant
import java.util.*

@Schema(name = "TodoManagement.Todo")
data class Todo(
    val id: UUID = UUID.randomUUID(),
    val title: String,
    val description: String = "",
    val isDone: Boolean = false,
    val createdAt: Instant = Instant.now(),
)

@Schema(name = "TodoManagement.TodoCreationPayload")
data class TodoCreationPayload(
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

@Schema(name = "TodoManagement.TodoUpdatePayload")
data class TodoUpdatePayload(
    val title: String?,
    val isDone: Boolean?,
    val description: String?,
) {
    fun toUpdatedTodo(todo: Todo): Todo {
        return todo.copy(
            title = this.title ?: todo.title,
            isDone = this.isDone ?: todo.isDone,
            description = this.description ?: todo.description,
        )
    }
}

@RestController
@RequestMapping(
    "/v1/todo-management",
    produces = ["application/json"]
)
@Tag(name = "Todo Management")
class TodoController {
    val todos = mutableListOf(
        Todo(title = "Create an OAS3 to TS with Zod generator", isDone = true),
        Todo(title = "Learn Spring Boot", isDone = false),
        Todo(title = "Do some Kotlin tutorials", isDone = false),
        Todo(title = "Go to Kickboxing morning session", isDone = false),
        Todo(title = "Explain to neighbours that you're not the \"PC Support guy\"", isDone = true),
    )

    @GetMapping("/todos")
    @Operation(
        summary = "Receive all todos.",
        description = "Returns a list of all todos.",
        operationId = "todoManagement.getTodos"
    )
    @ApiResponse(responseCode = "200", description = "Todos received.")
    fun todos(): MutableList<Todo> = todos

    @GetMapping("/todos/{id}")
    @Operation(
        summary = "Receive todo by id.",
        description = "Returns a todo by a specific id.",
        operationId = "todoManagement.getTodoById"
    )
    @ApiResponse(responseCode = "200", description = "Todo received.")
    @ApiResponse(responseCode = "404", description = "Todo not found.")
    fun getTodoById(@PathVariable id: UUID): Todo {
        val todo = todos.find { it.id == id }
        if (todo == null) throw ResponseStatusException(HttpStatus.NOT_FOUND)
        return todo
    }

    @PostMapping("/todos")
    @Operation(
        summary = "Create todo.",
        description = "Create a new todo.",
        operationId = "todoManagement.createTodo"
    )
    @ApiResponse(responseCode = "201", description = "Todo was created.")
    @ResponseStatus(HttpStatus.CREATED)
    fun createTodo(@RequestBody data: TodoCreationPayload): Todo {
        val newTodo = data.toTodo()
        todos.add(newTodo)
        return newTodo
    }

    @PatchMapping("/todos/{id}")
    @Operation(
        summary = "Update todo.",
        description = "Update existing todo.",
        operationId = "todoManagement.updateTodo"
    )
    @ApiResponse(responseCode = "200", description = "Todo was updated.")
    @ApiResponse(responseCode = "404", description = "Todo not found.")
    fun updateTodo(
        @RequestBody data: TodoUpdatePayload,
        @PathVariable id: UUID,
    ): Todo {
        val todoIndex = todos.indexOfFirst { it.id == id }
        if (todoIndex == -1) throw ResponseStatusException(HttpStatus.NOT_FOUND)
        val updatedTodo = data.toUpdatedTodo(todos[todoIndex])
        todos[todoIndex] = updatedTodo
        return updatedTodo
    }

    @DeleteMapping("/todos/{id}")
    @Operation(
        summary = "Delete todo.",
        description = "Delete existing todo.",
        operationId = "todoManagement.removeTodo"
    )
    @ApiResponse(responseCode = "200", description = "Todo was deleted.")
    @ApiResponse(responseCode = "404", description = "Todo not found.")
    fun removeTodo(@PathVariable id: UUID) {
        todos.removeIf { it.id == id }
    }
}