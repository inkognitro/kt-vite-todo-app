import { CardDescription, CardTitle } from '@/components/ui/card'
import { DefaultPageLayout } from '@/components/page/layout'
import {
  CircleCheckBigIcon,
  CircleIcon,
  Edit2Icon,
  PlusIcon,
} from 'lucide-react'
import { TypographyH1 } from '@/components/ui/typography'
import {
  type ComponentProps,
  startTransition,
  useCallback,
  useOptimistic,
  useState,
} from 'react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormButton,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button.tsx'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Todo as ApiV1Todo } from '@/lib/api/todo-management/schemas.tsx'
import {
  useCreateTodoMutation,
  useTodoByIdQuery,
  useTodosQuery,
  useUpdateTodoMutation,
} from '@/lib/react-query/todoManagement.ts'

type WithOptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

const todoFormSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  isDone: z.boolean(),
})

type TodoFormFields = z.infer<typeof todoFormSchema>

function TodoForm({
  todo,
  onSubmit,
}: {
  todo?: WithOptionalFields<Omit<ApiV1Todo, 'createdAt'>, 'id'>
  onSubmit: (data: TodoFormFields) => void
}) {
  const form = useForm<TodoFormFields>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      title: todo?.title ?? '',
      description: todo?.description ?? '',
      isDone: todo?.isDone ?? false,
    },
  })
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data, event) => {
          event?.preventDefault()
          onSubmit(data)
        })}
        className="space-y-8"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isDone"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>is done</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col">
          {!todo && (
            <FormButton type="submit" className="block w-full">
              Add todo
            </FormButton>
          )}
          {!!todo && (
            <FormButton type="submit" className="block w-full">
              Save
            </FormButton>
          )}
        </div>
      </form>
    </Form>
  )
}

function UpdateTodoForm({
  todoId,
  onDone,
}: {
  todoId: string
  onDone: () => void
}) {
  const { data: todo, isLoading } = useTodoByIdQuery(todoId)
  const updateTodoMutation = useUpdateTodoMutation(todoId)
  if (isLoading) {
    return <>Is loading Todo...</>
  }
  return (
    <TodoForm
      todo={todo!}
      onSubmit={(data) => updateTodoMutation.mutateAsync(data).then(onDone)}
    />
  )
}

function CreateTodoForm({ onDone }: { onDone: () => void }) {
  const createTodoMutation = useCreateTodoMutation()
  return (
    <TodoForm
      onSubmit={(data) => createTodoMutation.mutateAsync(data).then(onDone)}
    />
  )
}

function TodoCard({
  todo,
  className,
  ...props
}: ComponentProps<'div'> & {
  todo: ApiV1Todo
}) {
  const updateTodoMutation = useUpdateTodoMutation(todo.id)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [optimisticTodo, setOptimisticIsDone] = useOptimistic(
    todo,
    (currentTodo, isDone: boolean) => {
      return { ...currentTodo, isDone }
    }
  )
  const updateTodoIsDone = useCallback(
    (isDone: boolean) => {
      startTransition(() => {
        setOptimisticIsDone(isDone)
      })
      updateTodoMutation.mutate({ isDone })
    },
    [updateTodoMutation, setOptimisticIsDone]
  )
  return (
    <div
      className={cn(
        'w-full rounded border p-4 flex flex-row space-x-4 items-center space-between',
        className
      )}
      {...props}
    >
      <button>
        {!optimisticTodo.isDone && (
          <CircleIcon
            className="text-gray-400"
            onClick={() => updateTodoIsDone(true)}
          />
        )}
        {optimisticTodo.isDone && (
          <CircleCheckBigIcon
            className="text-green-700"
            onClick={() => updateTodoIsDone(false)}
          />
        )}
      </button>
      <div className="grow">
        <CardTitle>{todo.title}</CardTitle>
        <CardDescription>{todo.description}</CardDescription>
      </div>
      <div className="space-x-2">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger>
            <Edit2Icon className="text-muted-foreground w-4 h-4" />
          </DialogTrigger>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader className="space-y-8">
              <DialogTitle>Edit: {todo.title}</DialogTitle>
              <UpdateTodoForm
                todoId={todo.id}
                onDone={() => setIsFormOpen(false)}
              />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

function App() {
  const { data: todos, isLoading } = useTodosQuery()
  const [isFormOpen, setIsFormOpen] = useState(false)
  return (
    <DefaultPageLayout>
      <main className="page-content-container max-w-[725px] p-8 space-y-6">
        <TypographyH1>List of all todos</TypographyH1>
        <div className="flex flex-row justify-end">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="w-4 h-4 " />
                Add new todo
              </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
              <DialogHeader className="space-y-8">
                <DialogTitle>Add new todo</DialogTitle>
                <CreateTodoForm onDone={() => setIsFormOpen(false)} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        {isLoading && <>Loading Todos...</>}
        {!!todos && (
          <div className="space-y-2">
            {todos.map((todo) => (
              <TodoCard key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </main>
    </DefaultPageLayout>
  )
}

export default App
