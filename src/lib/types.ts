import type { User } from 'better-auth'
import type { LucideIcon } from 'lucide-react'

export type NavPrimaryProps = {
  items: Array<{
    title: string
    to: string
    icon: LucideIcon
    activeOptions: { exact: boolean }
  }>
}

export type NavUserProps = {
  user: User
}
