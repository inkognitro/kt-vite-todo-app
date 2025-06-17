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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormButton,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button.tsx'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

type ApiV1Todo = {
  id: string
  title: string
  isDone: boolean
  description: string
}

type WithOptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

const todoFormSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(8),
  isDone: z.boolean(),
})

type TodoFormFields = z.infer<typeof todoFormSchema>

export function TodoForm({
  todo,
}: {
  todoId?: string
  todo: WithOptionalFields<ApiV1Todo, 'id'>
}) {
  const form = useForm<TodoFormFields>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: todo,
  })
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data, event) => {
          event?.preventDefault()
          console.log(data)
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
          {!todo.id && (
            <FormButton type="submit" className="block w-full">
              Add todo
            </FormButton>
          )}
          {!!todo.id && (
            <FormButton type="submit" className="block w-full">
              Save
            </FormButton>
          )}
        </div>
      </form>
    </Form>
  )
}

function TodoCard({
  todo,
  className,
  ...props
}: ComponentProps<'div'> & {
  todo: ApiV1Todo
}) {
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
      console.log(`update todo "isDone" with id "${todo.id}" to: `, isDone)
    },
    [setOptimisticIsDone, todo]
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
            onClick={() => updateTodoIsDone(true)}
          />
        )}
      </button>
      <div className="grow">
        <CardTitle>{todo.title}</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </div>
      <Dialog>
        <DialogTrigger>
          <Edit2Icon className="text-muted-foreground w-4 h-4" />
        </DialogTrigger>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader className="space-y-8">
            <DialogTitle>Edit: {todo.title}</DialogTitle>
            <TodoForm todoId={todo.id} todo={todo} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function App() {
  return (
    <DefaultPageLayout>
      <main className="page-content-container max-w-[725px] p-8 space-y-6">
        <TypographyH1>List of all todos</TypographyH1>
        <div className="flex flex-row justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="w-4 h-4 " />
                Add new todo
              </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
              <DialogHeader className="space-y-8">
                <DialogTitle>Add new todo</DialogTitle>
                <TodoForm
                  todo={{
                    title: '',
                    description: '',
                    isDone: false,
                  }}
                />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-2">
          {[...Array(10).keys()].map((index) => (
            <TodoCard
              key={index}
              todo={{
                id: `id-${index + 1}`,
                title: `Todo No ${index + 1}`,
                description: `This is the description of the Todo No ${index + 1}`,
                isDone: index % 2 === 0,
              }}
            />
          ))}
        </div>
      </main>
    </DefaultPageLayout>
  )
}

export default App
