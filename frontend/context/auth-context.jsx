"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { getUser, setUser, clearAuthStorage } from "@/utils/auth"
import { logoutUser, getMe } from "@/utils/api"
import { useRouter } from "next/navigation"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in (token is transparently handled via generic cookies now)
    const checkSession = async () => {
      try {
        const response = await getMe();
        if (response.data && response.data.user) {
          setUserState(response.data.user);
          setUser(response.data.user); // update localStorage backup just in case
        }
      } catch (err) {
        // Not authenticated or cookie expired
        clearAuthStorage();
        setUserState(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [])

  const login = (userData) => {
    setUser(userData)
    setUserState(userData)
  }

  const logout = async () => {
    try {
      await logoutUser() // Call to securely erase the HttpOnly backend cookie
    } catch (e) {
      console.error(e)
    }
    clearAuthStorage() // Clear user entity from local storage
    setUserState(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
