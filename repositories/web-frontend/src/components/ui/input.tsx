import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const inputVariants = cva(
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  {
    variants: {
      variant: {
        normal:
          'border-zinc-200 bg-white placeholder:text-zinc-500 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:file:text-zinc-50 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300',
        error:
          'border-red-400 bg-red-50 placeholder:text-red-300 text-red-500 focus-visible:ring-red-400',
      },
      componentSize: {
        md: 'px-3 py-1 text-sm',
        lg: 'px-3 py-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'normal',
      componentSize: 'md',
    },
  }
)

export type InputProps = React.ComponentProps<'input'> &
  VariantProps<typeof inputVariants>

function Input({
  className,
  variant,
  type,
  componentSize,
  ...props
}: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, componentSize, className }))}
      {...props}
    />
  )
}

export { Input }
