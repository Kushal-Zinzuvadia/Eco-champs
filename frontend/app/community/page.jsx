import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, MessageCircle, Heart, Share2, User } from "lucide-react"

const communityPosts = [
  {
    id: 1,
    user: "Sarah Green",
    avatar: "🌿",
    time: "2 hours ago",
    content:
      "Just completed my first plastic-free week! It was challenging but so rewarding. Here are my top 3 tips...",
    likes: 24,
    comments: 8,
    category: "Tips",
  },
  {
    id: 2,
    user: "Mike Eco",
    avatar: "♻️",
    time: "4 hours ago",
    content: "Amazing community garden project happening in downtown! Who wants to join this weekend? 🌱",
    likes: 18,
    comments: 12,
    category: "Events",
  },
  {
    id: 3,
    user: "Emma Nature",
    avatar: "🌍",
    time: "1 day ago",
    content: "DIY compost bin tutorial is now live! Super easy to make and perfect for apartment living.",
    likes: 45,
    comments: 15,
    category: "DIY",
  },
]

const topContributors = [
  { name: "Alex Rivera", points: 2450, badge: "🏆" },
  { name: "Jordan Kim", points: 2380, badge: "🥈" },
  { name: "Sam Chen", points: 2210, badge: "🥉" },
  { name: "Taylor Swift", points: 1890, badge: "⭐" },
  { name: "Casey Jones", points: 1650, badge: "🌟" },
]

export default function CommunityPage() {
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
            <Users className="mr-3 h-8 w-8 text-purple-600" />
            Community
          </h1>
          <p className="text-gray-600 mt-2">Connect with fellow EcoChamps and share your journey</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <input
                    type="text"
                    placeholder="Share your eco-friendly tip or achievement..."
                    className="flex-1 p-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      📸 Photo
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      🎯 Challenge
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      💡 Tip
                    </Button>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Community Posts */}
            {communityPosts.map((post) => (
              <Card key={post.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-xl">
                      {post.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-800">{post.user}</h3>
                        <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                          {post.category}
                        </span>
                        <span className="text-gray-500 text-sm">{post.time}</span>
                      </div>
                      <p className="text-gray-700 mb-4">{post.content}</p>
                      <div className="flex items-center space-x-6 text-gray-500">
                        <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-green-500 transition-colors">
                          <Share2 className="h-4 w-4" />
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Contributors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-purple-600">Top Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topContributors.map((contributor, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{contributor.badge}</span>
                        <div>
                          <p className="font-medium text-sm">{contributor.name}</p>
                          <p className="text-xs text-gray-500">{contributor.points} points</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">Community Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">1,247</div>
                    <div className="text-sm text-gray-600">Active Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">15,680</div>
                    <div className="text-sm text-gray-600">Items Recycled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">342</div>
                    <div className="text-sm text-gray-600">Challenges Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-orange-600">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  🌱 Join Local Group
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📅 Upcoming Events
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  💬 Discussion Forums
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🏆 Community Challenges
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
