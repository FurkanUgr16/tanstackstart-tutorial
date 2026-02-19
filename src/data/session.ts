import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { redirect } from '@tanstack/react-router'
import { auth } from '@/lib/auth'

export const getSessionFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = auth.api.getSession({ headers })
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!session) {
      throw redirect({ to: '/login' })
    }
    return session
  },
)
