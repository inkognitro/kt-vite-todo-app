import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AxiosRequestHandler } from '@/lib/api/core'
import axios from 'axios'
import { parse } from 'qs'
import { RequestHandlerProvider } from '@/lib/api-utils/requestHandler'

const queryClient = new QueryClient()

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
})

const httpRequestHandler = new AxiosRequestHandler({
  axios: axiosInstance,
  urlDecodeQueryString: (queryString) => parse(queryString),
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RequestHandlerProvider value={httpRequestHandler}>
        <App />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </RequestHandlerProvider>
    </QueryClientProvider>
  </StrictMode>
)
