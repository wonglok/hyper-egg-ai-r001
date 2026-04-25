'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import {
  MoreHorizontalIcon,
  FolderIcon,
  ArrowRightIcon,
  Trash2Icon,
  ArrowRight
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

export function NavProjects({
  projects
}: {
  projects: {
    name: string
    url: string
    icon: React.ReactNode
  }[]
}) {
  const navigate = useNavigate()
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {projects.length > 0 && <SidebarGroupLabel>AI & Settings</SidebarGroupLabel>}
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              {/* <span
                onClick={() => {
                  navigate(item.url)
                }}
              >
                {item.icon}
                <span>{item.name}</span>
              </span> */}

              <NavLink to={item.url}>
                {({ isActive }) => (
                  <span
                    className={`${'flex items-center justify-center'} ${isActive ? `text-lime-500` : ``}`}
                  >
                    {isActive ? <ArrowRight className="mr-1 text-lime-500"></ArrowRight> : ''}
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </span>
                )}
              </NavLink>
            </SidebarMenuButton>
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover className="aria-expanded:bg-muted">
                  <MoreHorizontalIcon />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem>
                  <FolderIcon className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowRightIcon className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2Icon className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </SidebarMenuItem>
        ))}
        {/* <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontalIcon className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
  )
}
