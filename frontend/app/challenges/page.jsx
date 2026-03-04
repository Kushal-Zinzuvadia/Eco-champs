"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Target, Clock, Users, Award, CheckCircle, Plus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import { getAllChallenges, joinChallenge, completeChallenge, createNewChallenge } from "@/utils/api"
import { useRouter } from "next/navigation"

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-800"
    case "Medium":
      return "bg-yellow-100 text-yellow-800"
    case "Hard":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getTimeLeft(endDate) {
  if (!endDate) return "No deadline"
  const now = new Date()
  const end = new Date(endDate)
  const diff = end - now
  if (diff <= 0) return "Ended"
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days > 0) return `${days}d`
  const hours = Math.floor(diff / (1000 * 60 * 60))
  return `${hours}h`
}

export default function ChallengesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionInProgress, setActionInProgress] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    rewardPoints: 50,
    startDate: "",
    endDate: "",
    tasks: [""],
  })

  useEffect(() => {
    // Redirect if not authenticated
    if (!user && !loading) {
      router.push("/login")
    }

    const fetchChallenges = async () => {
      if (!user) return

      try {
        setLoading(true)
        const response = await getAllChallenges()
        setChallenges(response.data)
      } catch (error) {
        console.error("Error fetching challenges:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChallenges()
  }, [user, router])

  const handleJoinChallenge = async (challengeId) => {
    if (!user) return

    setActionInProgress(challengeId)
    try {
      await joinChallenge(challengeId)

      // Update challenges list
      setChallenges(
        challenges.map((challenge) =>
          challenge._id === challengeId
            ? { ...challenge, participants: [...(challenge.participants || []), user.id] }
            : challenge,
        ),
      )
    } catch (error) {
      console.error("Error joining challenge:", error)
    } finally {
      setActionInProgress(null)
    }
  }

  const handleCompleteChallenge = async (challengeId) => {
    if (!user) return

    setActionInProgress(challengeId)
    try {
      await completeChallenge(challengeId)

      // Update challenges list
      setChallenges(
        challenges.map((challenge) =>
          challenge._id === challengeId ? { ...challenge, completedBy: [...(challenge.completedBy || []), user.id] } : challenge,
        ),
      )
    } catch (error) {
      console.error("Error completing challenge:", error)
    } finally {
      setActionInProgress(null)
    }
  }

  const handleCreateChallenge = async () => {
    if (!newChallenge.title.trim() || creating) return
    if (!newChallenge.description.trim()) return

    // Client-side date validation
    const today = new Date().toISOString().split("T")[0]
    if (newChallenge.startDate && newChallenge.startDate < today) {
      alert("Start date cannot be in the past")
      return
    }
    if (newChallenge.endDate && newChallenge.startDate && newChallenge.endDate <= newChallenge.startDate) {
      alert("End date must be after start date")
      return
    }
    if (Number(newChallenge.rewardPoints) < 1 || Number(newChallenge.rewardPoints) > 10000) {
      alert("Reward points must be between 1 and 10,000")
      return
    }

    setCreating(true)
    try {
      const payload = {
        ...newChallenge,
        tasks: newChallenge.tasks.filter(t => t.trim()),
        rewardPoints: Number(newChallenge.rewardPoints),
        isActive: true
      }
      const res = await createNewChallenge(payload)
      setChallenges([res.data, ...challenges])
      setNewChallenge({ title: "", description: "", rewardPoints: 50, startDate: "", endDate: "", tasks: [""] })
      setShowCreateForm(false)
    } catch (error) {
      console.error("Error creating challenge:", error)
    } finally {
      setCreating(false)
    }
  }

  const updateTask = (index, value) => {
    const updated = [...newChallenge.tasks]
    updated[index] = value
    setNewChallenge({ ...newChallenge, tasks: updated })
  }

  const addTaskField = () => {
    setNewChallenge({ ...newChallenge, tasks: [...newChallenge.tasks, ""] })
  }

  const removeTaskField = (index) => {
    const updated = newChallenge.tasks.filter((_, i) => i !== index)
    setNewChallenge({ ...newChallenge, tasks: updated.length ? updated : [""] })
  }

  // Filter challenges by status
  const isUserInList = (list) => {
    if (!list || !user) return false;
    const userId = user.id || user._id;
    return list.some(id => String(id) === String(userId) || (id && id._id === userId));
  };

  const activeChallenges = challenges.filter(
    (challenge) => isUserInList(challenge.participants) && !isUserInList(challenge.completedBy),
  )

  const availableChallenges = challenges.filter((challenge) => !isUserInList(challenge.participants))

  const completedChallenges = challenges.filter((challenge) => isUserInList(challenge.completedBy))

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Please Login</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to view challenges</p>
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
            <Target className="mr-3 h-8 w-8 text-yellow-600" />
            Challenges
          </h1>
          <p className="text-gray-600 mt-2">Take on eco-friendly challenges and earn points!</p>
          <Button
            className="mt-4 bg-yellow-600 hover:bg-yellow-700"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? <><X className="mr-2 h-4 w-4" /> Cancel</> : <><Plus className="mr-2 h-4 w-4" /> Create Challenge</>}
          </Button>
        </div>

        {/* Create Challenge Form */}
        {showCreateForm && (
          <Card className="mb-8 shadow-lg border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="text-lg text-yellow-600 flex items-center">
                <Plus className="mr-2 h-5 w-5" /> Create New Challenge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="challengeTitle">Title</Label>
                  <Input
                    id="challengeTitle"
                    placeholder="e.g., Plastic-Free Week"
                    value={newChallenge.title}
                    onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="challengeDesc">Description</Label>
                  <Input
                    id="challengeDesc"
                    placeholder="Describe the challenge..."
                    value={newChallenge.description}
                    onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="rewardPoints">Reward Points</Label>
                    <Input
                      id="rewardPoints"
                      type="number"
                      min="1"
                      max="10000"
                      value={newChallenge.rewardPoints}
                      onChange={(e) => setNewChallenge({ ...newChallenge, rewardPoints: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={newChallenge.startDate}
                      onChange={(e) => setNewChallenge({ ...newChallenge, startDate: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      min={newChallenge.startDate || new Date().toISOString().split("T")[0]}
                      value={newChallenge.endDate}
                      onChange={(e) => setNewChallenge({ ...newChallenge, endDate: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label>Tasks</Label>
                  <div className="space-y-2 mt-1">
                    {newChallenge.tasks.map((task, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Input
                          placeholder={`Task ${idx + 1}`}
                          value={task}
                          onChange={(e) => updateTask(idx, e.target.value)}
                        />
                        {newChallenge.tasks.length > 1 && (
                          <Button size="sm" variant="ghost" onClick={() => removeTaskField(idx)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={addTaskField}>
                      <Plus className="mr-1 h-3 w-3" /> Add Task
                    </Button>
                  </div>
                </div>
                <Button
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                  onClick={handleCreateChallenge}
                  disabled={creating || !newChallenge.title.trim()}
                >
                  {creating ? "Creating..." : "Create Challenge"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid md:grid-cols-2 gap-6">
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
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Active Challenges */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Challenges</h2>
              {activeChallenges.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {activeChallenges.map((challenge) => (
                    <Card key={challenge._id} className="shadow-lg border-l-4 border-l-yellow-500">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{challenge.title}</CardTitle>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}
                          >
                            {challenge.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{challenge.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-orange-500" />
                              {getTimeLeft(challenge.endDate)} left
                            </span>
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-blue-500" />
                              {challenge.participants.length} participants
                            </span>
                            <span className="flex items-center">
                              <Award className="h-4 w-4 mr-1 text-purple-500" />
                              {challenge.rewardPoints} points
                            </span>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{challenge.progress || 0}%</span>
                            </div>
                            <div className="bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${challenge.progress || 0}%` }}
                              ></div>
                            </div>
                          </div>
                          <Button
                            className="w-full bg-yellow-600 hover:bg-yellow-700"
                            onClick={() => handleCompleteChallenge(challenge._id)}
                            disabled={actionInProgress === challenge._id}
                          >
                            {actionInProgress === challenge._id ? "Processing..." : "Complete Challenge"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="shadow-lg">
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600">You don't have any active challenges. Join one below!</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Available Challenges */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Challenges</h2>
              {availableChallenges.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableChallenges.map((challenge) => (
                    <Card key={challenge._id} className="shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{challenge.title}</CardTitle>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}
                          >
                            {challenge.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{challenge.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-orange-500" />
                              {getTimeLeft(challenge.endDate)}
                            </span>
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-blue-500" />
                              {challenge.participants.length}
                            </span>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{challenge.rewardPoints}</div>
                            <div className="text-sm text-gray-600">points reward</div>
                          </div>
                          <Button
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => handleJoinChallenge(challenge._id)}
                            disabled={actionInProgress === challenge._id}
                          >
                            {actionInProgress === challenge._id ? "Processing..." : "Start Challenge"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="shadow-lg">
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600">No available challenges at the moment. Check back later!</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Completed Challenges */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Completed Challenges</h2>
              {completedChallenges.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {completedChallenges.map((challenge) => (
                    <Card key={challenge._id} className="shadow-lg bg-green-50 border-l-4 border-l-green-500">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                              <h3 className="font-semibold text-gray-800">{challenge.title}</h3>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{challenge.description}</p>
                            <p className="text-sm text-gray-500">
                              Completed {new Date(challenge.completedDate || Date.now()).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">+{challenge.rewardPoints}</div>
                            <div className="text-xs text-gray-600">points</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="shadow-lg">
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600">
                      You haven't completed any challenges yet. Start with an active challenge!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
