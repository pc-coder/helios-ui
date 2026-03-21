import { Button } from "@/components/ui/button"
import { HeliosLogo } from "@/components/helios-logo"
import { buildSSOUrl } from "@/lib/auth"

export function LoginPage() {
  function handleLogin() {
    window.location.href = buildSSOUrl()
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <HeliosLogo size={56} />
          <h1 className="text-3xl font-bold tracking-tight">Helios.ai</h1>

        </div>

        <Button size="lg" onClick={handleLogin} className="px-8">
          Proceed to login
        </Button>
      </div>
    </div>
  )
}
