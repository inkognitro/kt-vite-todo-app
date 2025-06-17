import {
  type AxiosRequestHandlerExecutionConfig,
  type ZodValidationRequestHandlerExecutionConfig,
} from '@/lib/api/core'

declare global {
  interface RequestHandlerExecutionConfig
    extends AxiosRequestHandlerExecutionConfig,
      ZodValidationRequestHandlerExecutionConfig {}
}
