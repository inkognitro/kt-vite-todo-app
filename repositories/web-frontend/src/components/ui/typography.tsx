import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { createElement } from 'react'

const typographyVariants = cva('leading-normal text-black dark:text-white', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-semibold',
      h2: 'scroll-m-10 text-2xl font-semibold',
      h3: 'scroll-m-5 text-xl font-semibold',
      p: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
})

type TypographyTag = HTMLElement['tagName']

function getDefaultVariant(
  tag: TypographyTag
): VariantProps<typeof typographyVariants>['variant'] {
  switch (tag) {
    case 'h1':
      return 'h1'
    case 'h2':
      return 'h2'
    case 'h3':
      return 'h3'
    default:
      return 'p'
  }
}

export type TypographyProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof typographyVariants> & {
    tag: HTMLElement['tagName']
  }

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ tag, variant, className, children, ...props }, ref) =>
    createElement(
      tag,
      {
        ...props,
        ref,
        className: cn(
          typographyVariants({
            variant: variant ?? getDefaultVariant(tag),
          }),
          className
        ),
      },
      children
    )
)
Typography.displayName = 'Typography'

export type TypographyHeadingProps = React.HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof typographyVariants>

function TypographyH1({
  className,
  variant,
  ...props
}: TypographyHeadingProps) {
  return (
    <p
      className={cn(
        typographyVariants({
          variant: variant ?? 'h1',
        }),
        className
      )}
      {...props}
    />
  )
}

function TypographyH2({
  className,
  variant,
  ...props
}: TypographyHeadingProps) {
  return (
    <p
      className={cn(
        typographyVariants({
          variant: variant ?? 'h2',
        }),
        className
      )}
      {...props}
    />
  )
}

function TypographyH3({
  className,
  variant,
  ...props
}: TypographyHeadingProps) {
  return (
    <p
      className={cn(
        typographyVariants({
          variant: variant ?? 'h3',
        }),
        className
      )}
      {...props}
    />
  )
}

function TypographyP({
  className,
  variant,
  ...props
}: React.ComponentProps<'p'> & VariantProps<typeof typographyVariants>) {
  return (
    <p
      className={cn(
        typographyVariants({
          variant: variant ?? 'p',
        }),
        className
      )}
      {...props}
    />
  )
}

export { TypographyH1, TypographyH2, TypographyH3, TypographyP }
