import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar'

import 'nprogress/nprogress.css'
import { useEffect } from 'react'
import { useHome } from '../HyperHome/useHome'
// import { ArrayBlock } from '@renderer/ui/ArrayBlock/ArrayBlock'
// import { TodoKanban } from '@renderer/ui/ArrayBlock/TodoKanban'
// import { Brain } from '@renderer/ui/ArrayBlock/Brain'
// import { MsgBlock } from '@renderer/ui/ArrayBlock/MsgBlock'
// import { Term } from '@renderer/ui/ArrayBlock/Term'
// import { SearchBar } from '@renderer/effects/SearchBar'

export function WorkspaceLayout({ name = '', children }) {
  if (!name) {
    return <div className="w-full h-full flex items-center justify-center">Missing Workspace</div>
  }

  useEffect(() => {
    useHome.setState({
      workspace: name
    })
  }, [name])

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar name={name} />

      <SidebarInset>
        <SideBarContnet>{children}</SideBarContnet>
      </SidebarInset>
    </SidebarProvider>
  )
}

function SideBarContnet({ children }) {
  let sidebar = useSidebar()

  return (
    <>
      {sidebar.open && (
        <>
          <div className="h-screen" style={{ width: `calc(100vw - 256px)` }}>
            {children}
          </div>
        </>
      )}
      {!sidebar.open && (
        <>
          <div className="h-screen" style={{ width: `calc(100vw - 256px)` }}>
            {children}
          </div>
        </>
      )}
    </>
  )
}
