import { HugeiconsIcon } from "@hugeicons/react"
import { Sun03Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { buildSSOUrl } from "@/lib/auth"

export function LoginPage() {
  function handleLogin() {
    window.location.href = buildSSOUrl()
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <HugeiconsIcon icon={Sun03Icon} size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Helios.ai</h1>
          <p className="text-sm text-muted-foreground">
            Enterprise Code &amp; API Hub
          </p>
        </div>

        <Button size="lg" onClick={handleLogin} className="px-8">
          Proceed to login
        </Button>
      </div>
    </div>
  )
}
