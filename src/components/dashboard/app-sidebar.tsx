import { BookmarkIcon, Compass, Import } from 'lucide-react'
import { Link, linkOptions } from '@tanstack/react-router'
import { NavPrimary } from './nav-primary'
import { NavUser } from './nav-user'
import type { NavPrimaryProps, NavUserProps } from '@/lib/types'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

const navItems: NavPrimaryProps['items'] = linkOptions([
  {
    title: 'Items',
    icon: BookmarkIcon,
    to: '/dashboard/items',
    activeOptions: { exact: false },
  },
  {
    title: 'Import',
    icon: Import,
    to: '/dashboard/import',
    activeOptions: { exact: false },
  },
  {
    title: 'Discover',
    icon: Compass,
    to: '/dashboard/discover',
    activeOptions: { exact: false },
  },
])

export function AppSidebar({ user }: NavUserProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <SidebarMenuItem>
          <SidebarMenuButton size={'lg'} asChild>
            <Link to="/dashboard">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <BookmarkIcon size={4} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="font-medium text-left">Recall</span>
                <span className="text-xs">Your AI Knowledge Base</span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <NavPrimary items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
