import { useLocation, Link } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare02Icon,
  SourceCodeIcon,
  ApiIcon,
  FolderOpenIcon,
  Sun01Icon,
  Sun03Icon,
  Moon01Icon,
} from "@hugeicons/core-free-icons"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useTheme } from "@/components/theme-provider"
import { ROUTES } from "@/lib/constants"

const navItems = [
  {
    label: "Dashboard",
    icon: DashboardSquare02Icon,
    href: ROUTES.DASHBOARD,
  },
  {
    label: "Code Search",
    icon: SourceCodeIcon,
    href: ROUTES.CODE_SEARCH,
  },
  {
    label: "API Search",
    icon: ApiIcon,
    href: ROUTES.API_SEARCH,
  },
  {
    label: "Projects",
    icon: FolderOpenIcon,
    href: ROUTES.PROJECTS,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  const resolvedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="Helios Hub">
              <Link to="/">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <HugeiconsIcon icon={Sun03Icon} size={18} />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold tracking-tight">Helios</span>
                  <span className="text-xs text-muted-foreground">Hub</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.href)

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.href}>
                        <HugeiconsIcon icon={item.icon} size={18} />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              tooltip={resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
            >
              <HugeiconsIcon
                icon={resolvedTheme === "dark" ? Sun01Icon : Moon01Icon}
                size={16}
              />
              <span>{resolvedTheme === "dark" ? "Light mode" : "Dark mode"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
