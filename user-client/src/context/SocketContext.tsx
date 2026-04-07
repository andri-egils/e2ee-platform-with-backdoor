import { createContext, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { AuthContext } from "./AuthContext"

export const SocketContext = createContext<Socket | null>(null)

export function SocketProvider({ children }) {
  const { token, loading } = useContext(AuthContext);
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    if (loading || !token) return

    const s = io("/", { auth: { token } })
    setSocket(s)

    return () => s.disconnect()
  }, [token, loading]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}