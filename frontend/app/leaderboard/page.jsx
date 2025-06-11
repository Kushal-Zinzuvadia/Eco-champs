"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trophy, Medal, Award, TrendingUp, User } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { getLeaderboard, getUserStats } from "@/utils/api"
import { useRouter } from "next/navigation"

const categories = [
  { name: "Weekly", value: "weekly", active: true },
  { name: "Monthly", value: "monthly", active: false },
  { name: "All Time", value: "all-time", active: false },
]

export default function LeaderboardPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [leaderboardData, setLeaderboardData] = useState([])
  const [userStats, setUserStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("weekly")

  useEffect(() => {
    if (!token && !loading) {
      router.push("/login")
    }
    const fetchLeaderboardData = async () => {
      if (!token || !user) return
      try {
        setLoading(true)
        const leaderboardResponse = await getLeaderboard(activeCategory, token)
        // Add rank and highlight current user
        const data = leaderboardResponse.data.map((u, idx) => ({
          ...u,
          rank: idx + 1,
          isCurrentUser: user && (u._id === user.id || u._id === user._id),
        }))
        setLeaderboardData(data)
        // Find current user's rank and points
        const current = data.find((u) => u.isCurrentUser)
        setUserStats({
          rank: current ? current.rank : "-",
          totalPoints: current ? current.ecoPoints : 0,
        })
      } catch (error) {
        console.error("Error fetching leaderboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboardData()
  }, [token, user, activeCategory, router])

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
  }

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Please Login</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to view the leaderboard</p>
            <Link href="/login">
              <Button className="w-full bg-green-600 hover:bg-green-700">Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Trophy className="mr-3 h-8 w-8 text-orange-600" />
            Leaderboard
          </h1>
          <p className="text-gray-600 mt-2">See how you rank among fellow EcoChamps</p>
        </div>
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Leaderboard */}
          <div className="lg:col-span-3">
            {/* Category Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryChange(category.value)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeCategory === category.value
                      ? "bg-white text-orange-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            {loading ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="text-center shadow-lg">
                      <CardContent className="p-6">
                        <div className="h-10 w-10 bg-gray-100 rounded-full animate-pulse mx-auto mb-2"></div>
                        <div className="h-4 bg-gray-100 rounded-md animate-pulse w-3/4 mx-auto mb-1"></div>
                        <div className="h-3 bg-gray-100 rounded-md animate-pulse w-1/2 mx-auto mb-2"></div>
                        <div className="h-6 bg-gray-100 rounded-md animate-pulse w-1/3 mx-auto mb-1"></div>
                        <div className="h-3 bg-gray-100 rounded-md animate-pulse w-1/4 mx-auto"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Medal className="mr-2 h-5 w-5 text-orange-600" />
                      Full Rankings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse"></div>
                            <div>
                              <div className="h-4 bg-gray-100 rounded-md animate-pulse w-24"></div>
                              <div className="h-3 bg-gray-100 rounded-md animate-pulse w-16 mt-1"></div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="h-4 bg-gray-100 rounded-md animate-pulse w-12 inline-block"></div>
                            <div className="h-3 bg-gray-100 rounded-md animate-pulse w-8 inline-block mt-1"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Top 3 Podium */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  {leaderboardData.slice(0, 3).map((user, index) => (
                    <Card
                      key={user._id}
                      className={`text-center shadow-lg ${
                        index === 0
                          ? "md:order-2 bg-gradient-to-b from-yellow-50 to-yellow-100 border-yellow-300"
                          : index === 1
                            ? "md:order-1 bg-gradient-to-b from-gray-50 to-gray-100 border-gray-300"
                            : "md:order-3 bg-gradient-to-b from-orange-50 to-orange-100 border-orange-300"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="text-4xl mb-2">
                          {/* Fallback avatar: first letter of name or icon */}
                          {user.avatar || user.name?.[0]?.toUpperCase() || <User />}
                        </div>
                        <h3 className="font-bold text-lg mb-1">{user.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {/* Fallback level: badge count or 'EcoChamps' */}
                          {user.badges?.length ? `Badges: ${user.badges.length}` : "EcoChamps"}
                        </p>
                        <div className="text-2xl font-bold text-orange-600 mb-1">{user.ecoPoints}</div>
                        <div className="text-sm text-gray-600">points</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {/* Full Leaderboard */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Medal className="mr-2 h-5 w-5 text-orange-600" />
                      Full Rankings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {leaderboardData.map((user) => (
                        <div
                          key={user._id}
                          className={`p-4 flex items-center justify-between hover:bg-gray-50 ${
                            user.isCurrentUser ? "bg-green-50 border-l-4 border-l-green-500" : ""
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                user.rank <= 3 ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {user.rank}
                            </div>
                            <div className="text-2xl">
                              {user.avatar || user.name?.[0]?.toUpperCase() || <User />}
                            </div>
                            <div>
                              <p className={`font-medium ${user.isCurrentUser ? "text-green-700" : ""}`}>
                                {user.name} {user.isCurrentUser && "(You)"}
                              </p>
                              <p className="text-sm text-gray-600">
                                {user.badges?.length ? `Badges: ${user.badges.length}` : "EcoChamps"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{user.ecoPoints}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600 flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="h-6 bg-gray-100 rounded-md animate-pulse w-1/4 mx-auto"></div>
                      <div className="h-3 bg-gray-100 rounded-md animate-pulse w-1/2 mx-auto mt-1"></div>
                    </div>
                    <div className="text-center">
                      <div className="h-6 bg-gray-100 rounded-md animate-pulse w-1/3 mx-auto"></div>
                      <div className="h-3 bg-gray-100 rounded-md animate-pulse w-1/2 mx-auto mt-1"></div>
                    </div>
                    <div className="text-center">
                      <div className="h-6 bg-gray-100 rounded-md animate-pulse w-1/4 mx-auto"></div>
                      <div className="h-3 bg-gray-100 rounded-md animate-pulse w-1/2 mx-auto mt-1"></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">#{userStats.rank}</div>
                      <div className="text-sm text-gray-600">Current Rank</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{userStats.totalPoints}</div>
                      <div className="text-sm text-gray-600">Total Points</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-purple-600 flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-500">Coming Soon!</p>
                </div>
              </CardContent>
            </Card>
            {/* Leaderboard Stats - hide demo numbers */}
          </div>
        </div>
      </div>
    </div>
  )
}
