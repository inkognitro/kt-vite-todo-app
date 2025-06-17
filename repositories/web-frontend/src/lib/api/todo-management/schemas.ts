export type Todo = {
  id: string
  title: string
  description: string
  isDone: boolean
  createdAt: string
}

export type CreateTodoPayload = {
  title?: string
  description?: string
  isDone?: boolean
}

export type UpdateTodoPayload = {
  title?: string
  description?: string
  isDone?: boolean
}
