import { Outlet } from "react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "@/components/app-sidebar"
import { SearchCommand } from "@/components/search-command"

export function Layout() {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="flex h-12 items-center border-b px-4">
            <SidebarTrigger />
          </div>
          <div className="mx-auto w-full max-w-6xl px-6 py-6">
            <Outlet />
          </div>
        </main>
        <SearchCommand />
      </SidebarProvider>
    </TooltipProvider>
  )
}
