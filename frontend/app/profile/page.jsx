"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Award, Target } from "lucide-react"
import { getUserProfile, getUserStats } from "@/utils/api"
import { useAuth } from "@/context/auth-context"

export default function ProfilePage() {
  const { user, token } = useAuth()
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError("")
      try {
        if (!user || !user.id) throw new Error('User not logged in')
        const profileRes = await getUserProfile(user.id, token)
        setProfile(profileRes.data)
        const statsRes = await getUserStats(user.id, token)
        setStats(statsRes.data)
      } catch (err) {
        setError('Failed to load profile')
      }
      setLoading(false)
    }
    if (user && token) fetchProfile()
  }, [user, token])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        </div>
        {loading && <div className="text-gray-500">Loading...</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-white" />
              </div>
              <CardTitle>{profile ? profile.name : "-"}</CardTitle>
              <p className="text-gray-600">{profile ? profile.email : ""}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Eco Score:</span>
                  <span className="font-bold text-green-600">{stats ? stats.ecoPoints : "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Badges:</span>
                  <span className="font-bold">{stats && stats.badges && stats.badges.length > 0 ? stats.badges.length : 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Logs:</span>
                  <span>{stats ? stats.logCount : "-"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {stats && stats.badges && stats.badges.length > 0 ? (
                    stats.badges.map((b, i) => (
                      <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">{b}</span>
                    ))
                  ) : (
                    <span className="text-gray-500">No badges yet.</span>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-blue-500" />
                  Waste Breakdown & Eco Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="font-semibold mb-2">Waste Breakdown</div>
                  <ul className="list-disc ml-6 text-gray-700">
                    {stats && stats.wasteBreakdown && Object.keys(stats.wasteBreakdown).length > 0 ? (
                      Object.entries(stats.wasteBreakdown).map(([type, qty]) => (
                        <li key={type}>{type}: <span className="font-bold">{qty}</span></li>
                      ))
                    ) : (
                      <li>No logs yet.</li>
                    )}
                  </ul>
                </div>
                <div className="font-semibold mb-2">Eco Impact</div>
                <ul className="list-disc ml-6 text-gray-700">
                  <li>CO₂ Saved: <span className="font-bold">{stats ? stats.co2Saved : 0} kg</span></li>
                  <li>Waste Diverted: <span className="font-bold">{stats ? stats.wasteDiverted : 0} kg</span></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
