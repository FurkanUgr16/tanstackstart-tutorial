import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen">
      <div className="absolute top-8 left-8">
        <Link to="/" className={buttonVariants({ variant: "link" })}>
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
      </div>
      <div className="flex items-center justify-center min-h-screen">
        <Outlet />
      </div>
    </div>
  )
}
