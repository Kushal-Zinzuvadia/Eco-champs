"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Trash2, Plus, CheckCircle } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { postWasteLog, getUserLogs } from "@/utils/api"
import { useRouter } from "next/navigation"

const wasteCategories = [
  { id: "plastic", name: "Plastic", icon: "🥤", color: "bg-blue-100 text-blue-800" },
  { id: "paper", name: "Paper", icon: "📄", color: "bg-green-100 text-green-800" },
  { id: "glass", name: "Glass", icon: "🍾", color: "bg-purple-100 text-purple-800" },
  { id: "metal", name: "Metal", icon: "🥫", color: "bg-gray-100 text-gray-800" },
  { id: "organic", name: "Organic", icon: "🍎", color: "bg-yellow-100 text-yellow-800" },
  { id: "electronic", name: "Electronic", icon: "📱", color: "bg-red-100 text-red-800" },
]

export default function LogWastePage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("")
  const [itemName, setItemName] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isLogging, setIsLogging] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [recentLogs, setRecentLogs] = useState([])
  const [todayStats, setTodayStats] = useState({
    itemsLogged: 0,
    pointsEarned: 0,
    weeklyGoal: { current: 0, target: 5 },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Redirect if not authenticated
    if (!token && !loading) {
      router.push("/login")
    }

    const fetchLogs = async () => {
      if (!token || !user) return

      try {
        setLoading(true)
        const response = await getUserLogs(user.id, token)
        const logs = response.data

        setRecentLogs(logs.slice(0, 5))

        // Calculate today's stats using log.date (not createdAt)
        const today = new Date().toDateString()
        const todayLogs = logs.filter((log) => {
          const logDate = log.date ? new Date(log.date).toDateString() : null
          return logDate === today
        })

        setTodayStats({
          itemsLogged: todayLogs.reduce((sum, log) => sum + (log.quantity || 1), 0),
          pointsEarned: todayLogs.reduce((sum, log) => sum + (log.ecoPointsEarned || 0), 0),
          weeklyGoal: {
            current: logs.filter((log) => {
              const logDate = log.date ? new Date(log.date) : null
              if (!logDate) return false
              const now = new Date()
              const weekStart = new Date(now)
              weekStart.setDate(now.getDate() - now.getDay())
              weekStart.setHours(0,0,0,0)
              return logDate >= weekStart
            }).reduce((sum, log) => sum + (log.quantity || 1), 0),
            target: 5,
          },
        })
      } catch (error) {
        console.error("Error fetching logs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [token, user, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedCategory || !itemName || !token || !user) return

    setIsLogging(true)

    try {
      const logData = {
        userId: user.id,
        type: selectedCategory, // Backend expects 'type'
        quantity,
        comment: itemName, // Store item name as comment
      }

      await postWasteLog(logData, token)

      setShowSuccess(true)
      setSelectedCategory("")
      setItemName("")
      setQuantity(1)

      // Refresh logs
      const response = await getUserLogs(user.id, token)
      setRecentLogs(response.data.slice(0, 5))

      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error("Error logging waste:", error)
    } finally {
      setIsLogging(false)
    }
  }

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Please Login</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to log waste</p>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Trash2 className="mr-3 h-8 w-8 text-blue-600" />
            Log Waste
          </h1>
          <p className="text-gray-600 mt-2">Track your recycling and waste management activities</p>
        </div>

        {showSuccess && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center text-green-800">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  Great job! Your waste log has been recorded and points added to your score.
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Log Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Plus className="mr-2 h-5 w-5" />
                  Add New Entry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category Selection */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Select Category</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {wasteCategories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setSelectedCategory(category.id)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedCategory === category.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="text-2xl mb-2">{category.icon}</div>
                          <div className="font-medium text-sm">{category.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="itemName">Item Name</Label>
                      <Input
                        id="itemName"
                        type="text"
                        placeholder="e.g., Plastic water bottle"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLogging || !selectedCategory || !itemName}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg"
                  >
                    {isLogging ? "Logging..." : "Log Waste Item"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">Today's Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Items Logged:</span>
                    <span className="font-bold">{todayStats.itemsLogged}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Points Earned:</span>
                    <span className="font-bold text-green-600">+{todayStats.pointsEarned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekly Goal:</span>
                    <span className="text-sm text-gray-600">
                      {todayStats.weeklyGoal.current}/{todayStats.weeklyGoal.target} items
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min((todayStats.weeklyGoal.current / todayStats.weeklyGoal.target) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-purple-600">Recycling Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium">💡 Clean containers before recycling</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium">🌱 Compost organic waste at home</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="font-medium">♻️ Check local recycling guidelines</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Logs */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Logs</h2>
          <Card className="shadow-lg">
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-12 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : recentLogs.length > 0 ? (
                <div className="divide-y">
                  {recentLogs.map((log) => (
                    <div key={log._id || log.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Trash2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{log.comment || log.itemName}</p>
                          <p className="text-sm text-gray-600">
                            {log.type || log.category} • {log.date ? new Date(log.date).toLocaleDateString() : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">+{log.ecoPointsEarned || log.points || 0}</div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p>No logs yet. Start recycling to see your history here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
