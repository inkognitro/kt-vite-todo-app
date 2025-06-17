import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  CreateTodoPayload,
  Todo,
  UpdateTodoPayload,
} from '@/lib/api/todo-management/schemas.tsx'

const todos: Todo[] = [
  {
    id: 'f2d39cac-1005-4434-8772-8536cb40177b',
    title: 'Todo mock 1',
    description: 'Foo',
    isDone: true,
    createdAt: '2025-06-17T15:19:33.331152400Z',
  },
  {
    id: '4925e449-6c89-4357-9cc5-400c7754e972',
    title: 'Todo mock 2',
    description: 'Foo',
    isDone: false,
    createdAt: '2025-06-17T15:19:33.331152400Z',
  },
  {
    id: 'fd11fb05-ed29-49d5-8ba5-7d71c6d0c908',
    title: 'Todo mock 3',
    description: 'Foo',
    isDone: false,
    createdAt: '2025-06-17T15:19:33.331152400Z',
  },
  {
    id: '090ab412-9ec6-4ac7-937a-fd679aa89aaa',
    title: 'Todo mock 4',
    description: 'Foo',
    isDone: false,
    createdAt: '2025-06-17T15:19:33.331152400Z',
  },
  {
    id: '10958149-1832-400d-a4ac-b8340b83dd16',
    title: 'Todo mock 5',
    description: 'Foo',
    isDone: true,
    createdAt: '2025-06-17T15:19:33.331152400Z',
  },
]

const todosQueryKey = ['todoManagement', 'todos']
export function useTodosQuery() {
  return useQuery({
    queryKey: todosQueryKey,
    queryFn: async (): Promise<Todo[]> => {
      return new Promise((resolve) => {
        resolve(todos)
      })
    },
  })
}

const createTodoByIdQueryKey = (todoId: string) => [
  'todoManagement',
  'todos',
  todoId,
]
export function useTodoByIdQuery(todoId: string) {
  return useQuery({
    queryKey: createTodoByIdQueryKey(todoId),
    queryFn: async (): Promise<Todo> => {
      return new Promise((resolve, reject) => {
        const todo = todos.find((t) => t.id === todoId)
        if (!todo) {
          reject(new Error(`todo with id ${todoId} not found`))
          return
        }
        resolve(todo)
      })
    },
  })
}

export function useCreateTodoMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['todoManagement', 'createTodo'],
    mutationFn: async (data: CreateTodoPayload) => {
      return new Promise((resolve) => {
        resolve({ ...data, id: crypto.randomUUID() })
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey })
    },
  })
}

export function useUpdateTodoMutation(todoId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['todoManagement', 'updateTodo', todoId],
    mutationFn: async (data: UpdateTodoPayload): Promise<Todo> => {
      return new Promise((resolve) => {
        const todo = todos.find((t) => t.id === todoId)
        // @ts-ignore
        resolve({ ...todo, ...data })
      })
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

export function useRemoveTodoMutation(todoId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['todoManagement', 'removeTodo', todoId],
    mutationFn: async (): Promise<undefined> => {
      return new Promise((resolve) => {
        resolve(undefined)
      })
    },
    onSuccess: () => {
      console.log('todos removed 1')

      const todos = queryClient.getQueryData<Todo[]>(todosQueryKey)
      if (todos && !!todos.find((t) => t.id === todoId)) {
        console.log('todos removed 2')

        queryClient.setQueryData(todosQueryKey, (oldTodos: Todo[]) => {
          return oldTodos.filter((t: Todo) => t.id !== todoId)
        })
      }
    },
  })
}
