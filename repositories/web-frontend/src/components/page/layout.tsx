import { Footer } from './footer'
import { cn } from '@/lib/utils'
import type { FC, PropsWithChildren } from 'react'

type DefaultPageLayoutProps = PropsWithChildren<{
  noFooterGap?: boolean
  bgOnMobile?: boolean
}>

export const DefaultPageLayout: FC<DefaultPageLayoutProps> = ({
  noFooterGap,
  bgOnMobile,
  children,
}) => {
  return (
    <div
      className={cn('flex flex-col min-h-screen', {
        'gap-y-12': !noFooterGap,
        'bg-[#F5F5F5] md:bg-transparent': !!bgOnMobile,
      })}
    >
      <div className="grow">
        <div>{children}</div>
      </div>
      <Footer />
    </div>
  )
}
