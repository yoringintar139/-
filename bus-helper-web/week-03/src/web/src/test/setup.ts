import '@testing-library/jest-dom'
import { beforeAll, afterAll, afterEach } from 'vitest'
import { server } from './msw/handlers'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
