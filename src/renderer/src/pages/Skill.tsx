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
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { SkillBlock } from '@renderer/ui/SkillBlock/SkillBlock'

export function Skill() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Embeddings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="gap-4 p-4 pt-0 h-full rounded-2xl">
          <div className="bg-muted/50 w-full h-full  rounded-2xl">
            <div>
              <SkillBlock
                soul={`you help write code or develop apps.`}
                item={{
                  _id: 'abc',
                  name: `i want to find inspiration`,
                  content: '',
                  isDir: false,
                  folder: []
                }}
                parent={'./'}
              ></SkillBlock>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
