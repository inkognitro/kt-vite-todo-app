import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  TodoCreationPayload,
  Todo,
  TodoUpdatePayload,
} from '@/lib/api/todo-management/schemas.tsx'
import { getRevealedResponseOrReject } from '@/lib/api/core'
import {
  createTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from '@/lib/api/todo-management'
import { useRequestHandler } from '@/lib/api-utils/requestHandler.ts'

const todosQueryKey = ['todoManagement', 'todos']
export function useTodosQuery() {
  const requestHandler = useRequestHandler()
  return useQuery({
    queryKey: todosQueryKey,
    queryFn: async (): Promise<Todo[]> => {
      const rr = await getRevealedResponseOrReject(
        200,
        'application/json',
        getTodos(requestHandler)
      )
      return rr.body
    },
  })
}

const createTodoByIdQueryKey = (todoId: string) => [
  'todoManagement',
  'todos',
  todoId,
]
export function useTodoByIdQuery(todoId: string) {
  const requestHandler = useRequestHandler()
  return useQuery({
    queryKey: createTodoByIdQueryKey(todoId),
    queryFn: async (): Promise<Todo> => {
      const rr = await getRevealedResponseOrReject(
        200,
        'application/json',
        getTodoById(requestHandler, {
          pathParams: { id: todoId },
        })
      )
      return rr.body
    },
  })
}

export function useCreateTodoMutation() {
  const queryClient = useQueryClient()
  const requestHandler = useRequestHandler()
  return useMutation({
    mutationKey: ['todoManagement', 'createTodo'],
    mutationFn: async (data: TodoCreationPayload) => {
      const rr = await getRevealedResponseOrReject(
        201,
        'application/json',
        createTodo(requestHandler, {
          contentType: 'application/json',
          body: data,
        })
      )
      return rr.body
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey })
    },
  })
}

export function useUpdateTodoMutation(todoId: string) {
  const queryClient = useQueryClient()
  const requestHandler = useRequestHandler()
  return useMutation({
    mutationKey: ['todoManagement', 'updateTodo', todoId],
    mutationFn: async (data: TodoUpdatePayload): Promise<Todo> => {
      const rr = await getRevealedResponseOrReject(
        200,
        'application/json',
        updateTodo(requestHandler, {
          contentType: 'application/json',
          body: data,
          pathParams: {
            id: todoId,
          },
        })
      )
      return rr.body
    },
    onSuccess: (updatedTodo) => {
      const todoByIdQueryKey = createTodoByIdQueryKey(todoId)
      const todo = queryClient.getQueryData<Todo>(todoByIdQueryKey)
      if (todo) {
        queryClient.setQueryData(todoByIdQueryKey, () => updatedTodo)
      }
      const todos = queryClient.getQueryData<Todo[]>(todosQueryKey)
      if (todos && !!todos.find((t) => t.id === todoId)) {
        queryClient.setQueryData(todosQueryKey, (oldTodos: Todo[]) => {
          return oldTodos.map((t: Todo) => {
            if (t.id === updatedTodo.id) {
              return updatedTodo
            }
            return t
          })
        })
      }
    },
  })
}
