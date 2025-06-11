"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { getToken, getUser, setToken, setUser, removeToken, removeUser } from "@/utils/auth"
import { useRouter } from "next/navigation"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null)
  const [token, setTokenState] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = getToken()
    const storedUser = getUser()

    if (storedToken && storedUser) {
      setTokenState(storedToken)
      setUserState(storedUser)
    }

    setLoading(false)
  }, [])

  const login = (userData, authToken) => {
    setToken(authToken)
    setUser(userData)
    setTokenState(authToken)
    setUserState(userData)
  }

  const logout = () => {
    removeToken()
    removeUser()
    setTokenState(null)
    setUserState(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, token, login, logout, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
