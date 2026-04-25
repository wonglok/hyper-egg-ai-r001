// import { AppSidebar } from '@/components/app-sidebar'
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator
// } from '@/components/ui/breadcrumb'
// import { Separator } from '@/components/ui/separator'
// import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

import 'nprogress/nprogress.css'
import { ArrayBlock } from '@renderer/ui/ArrayBlock/ArrayBlock'
// import { TodoKanban } from '@renderer/ui/ArrayBlock/TodoKanban'
// import { Brain } from '@renderer/ui/ArrayBlock/Brain'
import { MsgBlock } from '@renderer/ui/ArrayBlock/MsgBlock'
// import { Term } from '@renderer/ui/ArrayBlock/Term'
// import { SearchBar } from '@renderer/effects/SearchBar'

export function CLIBuilderPage() {
  return (
    <div className="">
      <ArrayBlock></ArrayBlock>

      {/* <TodoKanban agentName=""></TodoKanban> */}
      {/* <Term></Term> */}
      <MsgBlock></MsgBlock>

      {/* <Brain agentName=""></Brain> */}

      {/* <div className="flex mb-3 space-x-3">
        <TodoKanban agentName="frontend"></TodoKanban>
        <TodoKanban agentName="backend"></TodoKanban>
      </div>

      <div className="flex mb-3 space-x-3">
        <Brain agentName="frontend"></Brain>
        <Brain agentName="backend"></Brain>
      </div> */}

      {/*  */}
    </div>
  )
}
