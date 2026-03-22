/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import type { Session } from "@/lib/auth"
import { loadSession, saveSession, clearSession } from "@/lib/auth"
import { resetSessionTracingId } from "@/lib/tracing"

interface AuthContextState {
  session: Session | null
  setSession: (session: Session) => void
  logout: () => void
}

const AuthContext = React.createContext<AuthContextState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = React.useState<Session | null>(() =>
    loadSession()
  )

  const setSession = React.useCallback((session: Session) => {
    saveSession(session)
    setSessionState(session)
  }, [])

  const logout = React.useCallback(() => {
    clearSession()
    resetSessionTracingId()
    setSessionState(null)
  }, [])

  const value = React.useMemo(
    () => ({ session, setSession, logout }),
    [session, setSession, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
