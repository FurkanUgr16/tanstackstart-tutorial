import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button, buttonVariants } from '../ui/button'
import { authClient } from '../../lib/auth-client'
import { ThemeToggle } from './theme-toggle'

export function Navbar() {
  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Logout successfully')
        },
        onError: ({ error }) => {
          toast.error(error.message)
        },
      },
    })
  }

  const { data: session, isPending } = authClient.useSession()
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img
            src="https://tanstack.com/images/logos/logo-color-banner-600.png"
            alt="Tanstack Start Logo"
            className="size-8"
          />
          <h1 className="text-lg font-semibold">Tanstack Start</h1>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isPending ? null : session ? (
            <>
              <Button onClick={logout} variant={'destructive'}>
                Logout
              </Button>
              <Link
                to="/dashboard"
                className={buttonVariants({ variant: 'secondary' })}
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={buttonVariants({ variant: 'secondary' })}
              >
                Login
              </Link>
              <Link to="/signup" className={buttonVariants()}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
