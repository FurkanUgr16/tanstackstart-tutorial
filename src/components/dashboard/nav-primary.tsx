import { Link } from '@tanstack/react-router'

import type { NavPrimaryProps } from '@/lib/types'

import {
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavPrimary({ items }: NavPrimaryProps) {
  return (
    <SidebarGroup>
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild size={'sm'}>
                  <Link
                    activeProps={{ 'data-active': true }}
                    to={item.to}
                    activeOptions={item.activeOptions}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
    </SidebarGroup>
  )
}
