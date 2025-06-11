import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BarChart3, TrendingUp, TrendingDown, Calendar, Zap, Droplets, Leaf } from "lucide-react"

const monthlyData = [
  { month: "Jan", recycled: 12, points: 180 },
  { month: "Feb", recycled: 18, points: 270 },
  { month: "Mar", recycled: 25, points: 375 },
  { month: "Apr", recycled: 22, points: 330 },
  { month: "May", recycled: 30, points: 450 },
  { month: "Jun", recycled: 35, points: 525 },
]

const categoryBreakdown = [
  { category: "Plastic", count: 45, percentage: 35, color: "bg-blue-500" },
  { category: "Paper", count: 38, percentage: 30, color: "bg-green-500" },
  { category: "Glass", count: 25, percentage: 20, color: "bg-purple-500" },
  { category: "Metal", count: 12, percentage: 10, color: "bg-gray-500" },
  { category: "Organic", count: 8, percentage: 5, color: "bg-yellow-500" },
]

const impactStats = [
  {
    icon: Droplets,
    title: "Water Saved",
    value: "2,450",
    unit: "liters",
    change: "+15%",
    positive: true,
    color: "text-blue-600",
  },
  {
    icon: Zap,
    title: "Energy Saved",
    value: "180",
    unit: "kWh",
    change: "+22%",
    positive: true,
    color: "text-yellow-600",
  },
  {
    icon: Leaf,
    title: "CO₂ Reduced",
    value: "85",
    unit: "kg",
    change: "+8%",
    positive: true,
    color: "text-green-600",
  },
]

export default function InsightsPage() {
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
            <BarChart3 className="mr-3 h-8 w-8 text-cyan-600" />
            Insights
          </h1>
          <p className="text-gray-600 mt-2">Track your environmental impact and progress</p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {impactStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <div className="flex items-baseline space-x-1">
                        <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                        <span className="text-sm text-gray-500">{stat.unit}</span>
                      </div>
                      <div
                        className={`flex items-center mt-2 text-sm ${
                          stat.positive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stat.positive ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {stat.change} vs last month
                      </div>
                    </div>
                    <IconComponent className={`h-12 w-12 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Progress Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <Calendar className="mr-2 h-5 w-5" />
                Monthly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium w-8">{data.month}</span>
                      <div className="flex-1">
                        <div className="bg-gray-200 rounded-full h-2 w-32">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(data.recycled / 35) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{data.recycled} items</div>
                      <div className="text-xs text-gray-500">{data.points} pts</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-600">
                <BarChart3 className="mr-2 h-5 w-5" />
                Waste Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryBreakdown.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{category.category}</span>
                      <span className="text-sm text-gray-600">
                        {category.count} items ({category.percentage}%)
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className={`${category.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Weekly Summary */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-blue-600">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Items Recycled:</span>
                  <span className="font-bold">8</span>
                </div>
                <div className="flex justify-between">
                  <span>Points Earned:</span>
                  <span className="font-bold text-green-600">+120</span>
                </div>
                <div className="flex justify-between">
                  <span>Challenges:</span>
                  <span className="font-bold">2 active</span>
                </div>
                <div className="flex justify-between">
                  <span>Streak:</span>
                  <span className="font-bold text-orange-600">5 days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals Progress */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-orange-600">Goals Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Weekly Target</span>
                    <span className="text-sm">8/10</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full w-4/5"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Monthly Target</span>
                    <span className="text-sm">35/40</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-5/6"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Challenge Points</span>
                    <span className="text-sm">180/200</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full w-9/10"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-green-600">Recent Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
                  <span className="text-xl">🏆</span>
                  <div>
                    <p className="font-medium text-sm">100 Items Recycled!</p>
                    <p className="text-xs text-gray-600">Achieved 2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                  <span className="text-xl">🌱</span>
                  <div>
                    <p className="font-medium text-sm">5-Day Streak</p>
                    <p className="text-xs text-gray-600">Keep it up!</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                  <span className="text-xl">💧</span>
                  <div>
                    <p className="font-medium text-sm">Water Saver Badge</p>
                    <p className="text-xs text-gray-600">Earned last week</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
