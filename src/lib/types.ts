import type { LucideIcon } from 'lucide-react'

export type NavPrimaryProps = {
  items: Array<{
    title: string
    to: string
    icon: LucideIcon
    activeOptions: { exact: boolean }
  }>
}
