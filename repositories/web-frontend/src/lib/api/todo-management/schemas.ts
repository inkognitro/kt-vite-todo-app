export type Todo = {
  id: string
  title: string
  description: string
  isDone: boolean
  createdAt: string
}

export type TodoCreationPayload = {
  title?: string
  description?: string
  isDone?: boolean
}

export type TodoUpdatePayload = {
  title?: string
  description?: string
  isDone?: boolean
}
