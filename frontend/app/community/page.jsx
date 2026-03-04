"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, MessageCircle, Heart, Share2, User, Trash2, Send } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import {
  getCommunityPosts,
  createCommunityPost,
  toggleLikePost,
  addComment,
  deleteCommunityPost,
  getCommunityStats,
  getLeaderboard
} from "@/utils/api"

const categoryOptions = ["General", "Tips", "Events", "DIY"]
const categoryColors = {
  Tips: "bg-blue-100 text-blue-600",
  Events: "bg-yellow-100 text-yellow-600",
  DIY: "bg-orange-100 text-orange-600",
  General: "bg-purple-100 text-purple-600"
}

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function CommunityPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [topContributors, setTopContributors] = useState([])
  const [communityStats, setCommunityStats] = useState({ activeMembers: 0, totalItemsRecycled: 0, totalChallengesCompleted: 0 })
  const [loading, setLoading] = useState(true)
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostCategory, setNewPostCategory] = useState("General")
  const [posting, setPosting] = useState(false)
  const [commentInputs, setCommentInputs] = useState({}) // { postId: "text" }
  const [showComments, setShowComments] = useState({}) // { postId: true/false }

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      try {
        setLoading(true)
        const [postsRes, statsRes, leaderboardRes] = await Promise.all([
          getCommunityPosts(),
          getCommunityStats(),
          getLeaderboard("weekly")
        ])
        setPosts(postsRes.data)
        setCommunityStats(statsRes.data)

        const badges = ["🏆", "🥈", "🥉", "⭐", "🌟"]
        setTopContributors(
          leaderboardRes.data.slice(0, 5).map((u, i) => ({
            name: u.name,
            points: u.ecoPoints,
            badge: badges[i] || "🌟"
          }))
        )
      } catch (error) {
        console.error("Error fetching community data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || posting) return
    setPosting(true)
    try {
      const res = await createCommunityPost({ content: newPostContent, category: newPostCategory })
      setPosts([res.data, ...posts])
      setNewPostContent("")
      setNewPostCategory("General")
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setPosting(false)
    }
  }

  const handleToggleLike = async (postId) => {
    try {
      const res = await toggleLikePost(postId)
      setPosts(posts.map(p => {
        if (p._id === postId) {
          const liked = res.data.liked
          return {
            ...p,
            likes: liked
              ? [...p.likes, user.id]
              : p.likes.filter(id => id !== user.id)
          }
        }
        return p
      }))
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const handleAddComment = async (postId) => {
    const content = commentInputs[postId]
    if (!content?.trim()) return
    try {
      const res = await addComment(postId, content)
      setPosts(posts.map(p => p._id === postId ? { ...p, comments: res.data } : p))
      setCommentInputs({ ...commentInputs, [postId]: "" })
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const handleDeletePost = async (postId) => {
    try {
      await deleteCommunityPost(postId)
      setPosts(posts.filter(p => p._id !== postId))
    } catch (error) {
      console.error("Error deleting post:", error)
    }
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
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreatePost()}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {categoryOptions.map((cat) => (
                      <Button
                        key={cat}
                        size="sm"
                        variant={newPostCategory === cat ? "default" : "outline"}
                        className={`text-xs ${newPostCategory === cat ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                        onClick={() => setNewPostCategory(cat)}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleCreatePost}
                    disabled={posting || !newPostContent.trim()}
                  >
                    {posting ? "Posting..." : "Post"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <Card className="shadow-lg">
                <CardContent className="p-8 text-center text-gray-500">
                  <p>No posts yet. Be the first to share something with the community! 🌱</p>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post._id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-xl">
                        🌿
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-800">{post.author?.name || "Unknown"}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${categoryColors[post.category] || categoryColors.General}`}>
                            {post.category}
                          </span>
                          <span className="text-gray-500 text-sm">{timeAgo(post.createdAt)}</span>
                          {post.author?._id === user?.id && (
                            <button
                              onClick={() => handleDeletePost(post._id)}
                              className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-gray-700 mb-4">{post.content}</p>
                        <div className="flex items-center space-x-6 text-gray-500">
                          <button
                            className={`flex items-center space-x-1 transition-colors ${post.likes?.some(id => id === user?.id || id?._id === user?.id) ? "text-red-500" : "hover:text-red-500"}`}
                            onClick={() => handleToggleLike(post._id)}
                          >
                            <Heart className={`h-4 w-4 ${post.likes?.some(id => id === user?.id || id?._id === user?.id) ? "fill-current" : ""}`} />
                            <span className="text-sm">{post.likes?.length || 0}</span>
                          </button>
                          <button
                            className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                            onClick={() => setShowComments({ ...showComments, [post._id]: !showComments[post._id] })}
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm">{post.comments?.length || 0}</span>
                          </button>
                        </div>

                        {/* Comments Section */}
                        {showComments[post._id] && (
                          <div className="mt-4 space-y-3 border-t pt-4">
                            {post.comments?.map((comment, idx) => (
                              <div key={idx} className="flex items-start space-x-2">
                                <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                                  <User className="h-3 w-3" />
                                </div>
                                <div className="bg-gray-50 rounded-lg p-2 flex-1">
                                  <p className="text-xs font-semibold text-gray-700">{comment.author?.name || "User"}</p>
                                  <p className="text-sm text-gray-600">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                placeholder="Write a comment..."
                                className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:border-green-500"
                                value={commentInputs[post._id] || ""}
                                onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                                onKeyDown={(e) => e.key === "Enter" && handleAddComment(post._id)}
                              />
                              <Button size="sm" variant="ghost" onClick={() => handleAddComment(post._id)}>
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
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
                  {topContributors.length === 0 && !loading && (
                    <p className="text-sm text-gray-500">No contributors yet.</p>
                  )}
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
                    <div className="text-2xl font-bold text-green-600">{communityStats.activeMembers.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Active Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{communityStats.totalItemsRecycled.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Items Recycled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{communityStats.totalChallengesCompleted.toLocaleString()}</div>
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
                <Link href="/challenges">
                  <Button variant="outline" className="w-full justify-start">
                    🏆 Community Challenges
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button variant="outline" className="w-full justify-start">
                    📊 Leaderboard
                  </Button>
                </Link>
                <Link href="/log-waste">
                  <Button variant="outline" className="w-full justify-start">
                    ♻️ Log Waste
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
