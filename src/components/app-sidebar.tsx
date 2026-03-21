import { useLocation, Link } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare02Icon,
  SourceCodeIcon,
  ApiIcon,
  FolderOpenIcon,
  Sun01Icon,
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
import { HeliosLogo } from "@/components/helios-logo"
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
              <Link to="/" className="group-data-[collapsible=icon]:justify-center">
                <HeliosLogo size={28} className="shrink-0" />
                <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-semibold tracking-tight">
                    Helios
                  </span>
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
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              tooltip={resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
            >
              <HugeiconsIcon
                icon={resolvedTheme === "dark" ? Sun01Icon : Moon01Icon}
                size={16}
              />
              <span>
                {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
