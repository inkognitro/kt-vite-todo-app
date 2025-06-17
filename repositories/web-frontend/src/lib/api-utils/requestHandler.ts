import { type RequestHandler } from '@/lib/api/core'
import { createContext, useContext } from 'react'

const requestHandlerContext = createContext<null | RequestHandler>(null)

export const RequestHandlerProvider = requestHandlerContext.Provider

export function useRequestHandler(): RequestHandler {
  const ctx = useContext(requestHandlerContext)
  if (!ctx) {
    throw new Error(
      'no RequestHandler was provided with RequestHandlerProvider'
    )
  }
  return ctx
}
