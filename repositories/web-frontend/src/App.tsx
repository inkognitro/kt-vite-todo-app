import { CardDescription, CardTitle } from '@/components/ui/card'
import { DefaultPageLayout } from '@/components/page/layout'
import { CircleCheckBigIcon, CircleIcon } from 'lucide-react'
import { TypographyH1 } from '@/components/ui/typography'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils.ts'

type ApiV1Todo = {
  title: string
  isDone: boolean
  description: string
}

type TodoCardProps = ComponentProps<'div'> & {
  todo: ApiV1Todo
}

function TodoCard({ todo, className, ...props }: TodoCardProps) {
  // todo: useOptimistic to update the todo
  return (
    <div
      className={cn(
        'w-full rounded border p-4 flex flex-row space-x-4 items-center space-between',
        className
      )}
      {...props}
    >
      <div className="grow">
        <CardTitle>{todo.title}</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </div>
      <button>
        {!todo.isDone && <CircleIcon className="text-gray-400" />}
        {todo.isDone && <CircleCheckBigIcon className="text-green-700" />}
      </button>
    </div>
  )
}

function App() {
  return (
    <DefaultPageLayout>
      <main className="page-content-container max-w-[725px] p-8 space-y-6">
        <TypographyH1>List of all todos</TypographyH1>
        <section className="space-y-2">
          {[...Array(10).keys()].map((index) => (
            <TodoCard
              key={index}
              todo={{
                title: `Todo No ${index + 1}`,
                description: `This is the description of the Todo No ${index + 1}`,
                isDone: index % 2 === 0,
              }}
            />
          ))}
        </section>
      </main>
    </DefaultPageLayout>
  )
}

export default App
