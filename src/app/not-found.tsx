import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { HeliosLogo } from "@/components/helios-logo"

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <HeliosLogo size={48} className="opacity-30" />
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>
      <Button asChild>
        <Link to="/">Back to Dashboard</Link>
      </Button>
    </div>
  )
}
