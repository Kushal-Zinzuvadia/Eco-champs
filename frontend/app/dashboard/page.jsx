"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Trash2, Trophy, BarChart3, Users, Target } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { getUserLogs, getUserStats, getAllChallenges } from "@/utils/api"

const dashboardButtons = [
  { name: "Profile", icon: User, color: "bg-green-500 hover:bg-green-600", href: "/profile" },
  { name: "Log Waste", icon: Trash2, color: "bg-blue-500 hover:bg-blue-600", href: "/log-waste" },
  { name: "Challenges", icon: Target, color: "bg-yellow-500 hover:bg-yellow-600", href: "/challenges" },
  { name: "Leaderboard", icon: Trophy, color: "bg-orange-500 hover:bg-orange-600", href: "/leaderboard" },
  { name: "Insights", icon: BarChart3, color: "bg-cyan-500 hover:bg-cyan-600", href: "/insights" },
  { name: "Community", icon: Users, color: "bg-purple-500 hover:bg-purple-600", href: "/community" },
]

export default function DashboardPage() {
  const { user, token, logout } = useAuth()
  const [recentLogs, setRecentLogs] = useState([])
  const [activeChallenges, setActiveChallenges] = useState([])
  const [stats, setStats] = useState({ ecoScore: 0, itemsRecycled: 0, challengesCompleted: 0, rank: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token || !user) return

      try {
        setLoading(true)

        // Fetch user logs
        const logsResponse = await getUserLogs(user.id, token)
        setRecentLogs(logsResponse.data.slice(0, 5))

        // Fetch user stats
        const statsResponse = await getUserStats(user.id, token)
        setStats(statsResponse.data)

        // Fetch challenges
        const challengesResponse = await getAllChallenges(token)
        setActiveChallenges(
          challengesResponse.data
            .filter((challenge) => challenge.participants.includes(user.id) && !challenge.completedBy.includes(user.id))
            .slice(0, 2),
        )
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [token, user])

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Please Login</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to view your dashboard</p>
            <div className="space-y-4">
              <Link href="/login" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700">Login</Button>
              </Link>
              <Link href="/signup" className="block">
                <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                  Sign Up
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-green-600">
              EcoChamps 🌱
            </Link>
            <div className="flex space-x-4 items-center">
              {user ? (
                <>
                  <span className="text-gray-600">Hello, {user.name}</span>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome to EcoChamps{user ? `, ${user.name}` : ""} 🌱
          </h1>
          <p className="text-xl md:text-2xl text-green-600 font-semibold">
            Your current eco-score: {stats.ecoScore || 0}
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3 animate-pulse"></div>
                <div className="h-2 bg-gray-200 rounded w-full mt-4 animate-pulse"></div>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Dashboard Highlights */
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Trash2 className="mr-2 h-5 w-5" />
                  Recent Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentLogs.length > 0 ? (
                  <>
                    <p className="text-gray-700">You have recycled {recentLogs.length} items recently. Great job! ♻️</p>
                    <div className="mt-4">
                      <div className="bg-green-100 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${Math.min((recentLogs.length / 5) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{recentLogs.length}/5 of weekly goal</p>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-700">No recent logs. Start recycling to earn points! ♻️</p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Target className="mr-2 h-5 w-5" />
                  Active Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeChallenges.length > 0 ? (
                  <div className="space-y-3">
                    {activeChallenges.map((challenge) => (
                      <div key={challenge.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <span className="font-medium">{challenge.title}</span>
                        <span className="text-sm text-yellow-600 bg-yellow-200 px-2 py-1 rounded-full">
                          In Progress
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700">No active challenges. Join a challenge to earn more points!</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {dashboardButtons.map((button) => {
            const IconComponent = button.icon
            return (
              <Link key={button.name} href={button.href}>
                <Card
                  className={`${button.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer h-32`}
                >
                  <CardContent className="flex flex-col items-center justify-center h-full p-4">
                    <IconComponent className="h-8 w-8 mb-2" />
                    <span className="text-sm md:text-base font-semibold text-center">{button.name}</span>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center shadow-lg">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-green-600">{stats.itemsRecycled || 0}</div>
              <div className="text-gray-600">Items Recycled</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-blue-600">{stats.challengesCompleted || 0}</div>
              <div className="text-gray-600">Challenges Completed</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-purple-600">#{stats.rank || 0}</div>
              <div className="text-gray-600">Leaderboard Rank</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
