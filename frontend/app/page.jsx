import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-600 mb-2">EcoChamps 🌱</h1>
          <p className="text-gray-600 text-lg">Join the gamified sustainability revolution</p>
        </div>

        <div className="space-y-4">
          <Link href="/login" className="block">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl">Login</Button>
          </Link>

          <Link href="/signup" className="block">
            <Button
              variant="outline"
              className="w-full border-green-600 text-green-600 hover:bg-green-50 py-3 text-lg rounded-xl"
            >
              Sign Up
            </Button>
          </Link>

          <Link href="/dashboard" className="block">
            <Button variant="ghost" className="w-full text-green-600 hover:bg-green-50 py-3 text-lg rounded-xl">
              View Dashboard Demo
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Start your eco-friendly journey today!</p>
        </div>
      </div>
    </div>
  )
}
