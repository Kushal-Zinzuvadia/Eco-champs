"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Target, Clock, Users, Award, CheckCircle } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { getAllChallenges, joinChallenge, completeChallenge } from "@/utils/api"
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

export default function ChallengesPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionInProgress, setActionInProgress] = useState(null)

  useEffect(() => {
    // Redirect if not authenticated
    if (!token && !loading) {
      router.push("/login")
    }

    const fetchChallenges = async () => {
      if (!token || !user) return

      try {
        setLoading(true)
        const response = await getAllChallenges(token)
        setChallenges(response.data)
      } catch (error) {
        console.error("Error fetching challenges:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChallenges()
  }, [token, user, router])

  const handleJoinChallenge = async (challengeId) => {
    if (!token || !user) return

    setActionInProgress(challengeId)
    try {
      await joinChallenge(challengeId, token)

      // Update challenges list
      setChallenges(
        challenges.map((challenge) =>
          challenge.id === challengeId
            ? { ...challenge, participants: [...challenge.participants, user.id] }
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
    if (!token || !user) return

    setActionInProgress(challengeId)
    try {
      await completeChallenge(challengeId, token)

      // Update challenges list
      setChallenges(
        challenges.map((challenge) =>
          challenge.id === challengeId ? { ...challenge, completedBy: [...challenge.completedBy, user.id] } : challenge,
        ),
      )
    } catch (error) {
      console.error("Error completing challenge:", error)
    } finally {
      setActionInProgress(null)
    }
  }

  // Filter challenges by status
  const activeChallenges = challenges.filter(
    (challenge) => challenge.participants.includes(user?.id) && !challenge.completedBy.includes(user?.id),
  )

  const availableChallenges = challenges.filter((challenge) => !challenge.participants.includes(user?.id))

  const completedChallenges = challenges.filter((challenge) => challenge.completedBy.includes(user?.id))

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
        </div>

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
                    <Card key={challenge.id} className="shadow-lg border-l-4 border-l-yellow-500">
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
                              {challenge.timeLeft} left
                            </span>
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-blue-500" />
                              {challenge.participants.length} participants
                            </span>
                            <span className="flex items-center">
                              <Award className="h-4 w-4 mr-1 text-purple-500" />
                              {challenge.points} points
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
                            onClick={() => handleCompleteChallenge(challenge.id)}
                            disabled={actionInProgress === challenge.id}
                          >
                            {actionInProgress === challenge.id ? "Processing..." : "Complete Challenge"}
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
                    <Card key={challenge.id} className="shadow-lg hover:shadow-xl transition-shadow">
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
                              {challenge.duration}
                            </span>
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-blue-500" />
                              {challenge.participants.length}
                            </span>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{challenge.points}</div>
                            <div className="text-sm text-gray-600">points reward</div>
                          </div>
                          <Button
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => handleJoinChallenge(challenge.id)}
                            disabled={actionInProgress === challenge.id}
                          >
                            {actionInProgress === challenge.id ? "Processing..." : "Start Challenge"}
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
                    <Card key={challenge.id} className="shadow-lg bg-green-50 border-l-4 border-l-green-500">
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
                            <div className="text-lg font-bold text-green-600">+{challenge.points}</div>
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
