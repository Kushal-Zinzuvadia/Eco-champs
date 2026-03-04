"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider, useAuth } from "@/context/auth-context"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const inter = Inter({ subsets: ["latin"] })

function ClientGuard({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const publicRoutes = ["/login", "/signup"]
    if (!loading && !user && !publicRoutes.includes(pathname)) {
      router.replace("/login")
    }
    if (!loading && user && publicRoutes.includes(pathname)) {
      router.replace("/dashboard")
    }
  }, [user, loading, pathname, router])

  return children
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>EcoChamps</title>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ClientGuard>{children}</ClientGuard>
        </AuthProvider>
      </body>
    </html>
  )
}
