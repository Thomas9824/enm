import { useEffect, useState } from "react"
import netlifyIdentity from "netlify-identity-widget"
import type { User } from "netlify-identity-widget"

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    netlifyIdentity.on("init", (u) => {
      setUser(u)
      setReady(true)
    })
    netlifyIdentity.on("login", (u) => {
      setUser(u)
      netlifyIdentity.close()
    })
    netlifyIdentity.on("logout", () => setUser(null))

    netlifyIdentity.init()

    return () => {
      netlifyIdentity.off("init")
      netlifyIdentity.off("login")
      netlifyIdentity.off("logout")
    }
  }, [])

  if (!ready) return null

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[var(--color-background)]">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold text-[var(--color-foreground)]">Accès restreint</h1>
          <p className="text-sm text-[var(--color-muted-foreground)]">Connectez-vous pour accéder à l'application.</p>
        </div>
        <button
          onClick={() => netlifyIdentity.open("login")}
          className="px-6 py-2.5 rounded-xl bg-[var(--color-poly)] text-white text-sm font-semibold hover:opacity-80 transition-opacity"
        >
          Se connecter
        </button>
      </div>
    )
  }

  return <>{children}</>
}
