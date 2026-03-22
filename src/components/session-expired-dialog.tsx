import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { onSessionExpired } from "@/lib/auth-interceptor"
import { ROUTES } from "@/lib/constants"

export function SessionExpiredDialog() {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    return onSessionExpired(() => setOpen(true))
  }, [])

  function handleRelogin() {
    setOpen(false)
    logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-sm"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Session Expired</DialogTitle>
          <DialogDescription>
            Your session has expired. Please log in again to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleRelogin} className="w-full">
            Log in again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
