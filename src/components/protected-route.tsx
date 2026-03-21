import { Navigate, Outlet } from "react-router"
import { useAuth } from "./auth-provider"
import { ROUTES } from "@/lib/constants"

export function ProtectedRoute() {
  const { session } = useAuth()

  if (!session) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <Outlet />
}
