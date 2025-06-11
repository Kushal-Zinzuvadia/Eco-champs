"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signup } from "@/utils/api"
import { useAuth } from "@/context/auth-context"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { login: authLogin } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await signup({ name, email, password })
      const { token, user } = response.data

      // Store token and user data
      authLogin(user, token)

      setSuccess(true)

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Signup error:", error)
      setError(error.response?.data?.message || "Error creating account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Welcome to EcoChamps!</h2>
            <p className="text-gray-600 mb-4">Your account has been created successfully.</p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-green-600">Join EcoChamps! 🌍</CardTitle>
          <CardDescription className="text-gray-600">Start your sustainable journey today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-xl border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg font-semibold"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
                Login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
