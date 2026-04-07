import { createContext, useEffect, useState } from "react"
import { registerUser, validateUser } from "../api/auth"

interface AuthState {
  token: string | null
  shortCode: string | null
  loading: boolean
}

export const AuthContext = createContext<any>(null);

export function AuthProvider({ children }) {
  const [token, setToken]       = useState<string | null>(null)
  const [shortCode, setShortCode] = useState<string | null>(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    (async () => {
      let localToken = localStorage.getItem("token")

      if (!localToken) {
        // Register new anonymous user
        const { token, short_code } = await registerUser()
        localStorage.setItem("token", token)
        setToken(token)
        setShortCode(short_code)
        setLoading(false)
        return;
      }

      // Validate token
      const res = await validateUser(localToken)
      if (res.valid) {
        setToken(localToken);
        setShortCode(res.short_code);
      } else {
        localStorage.removeItem("token")
      }

      setLoading(false)
    })()
  }, [])

  return (
    <AuthContext.Provider value={{ token, shortCode, loading }}>
      {children}
    </AuthContext.Provider>
  );
}