import axios from "axios"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export const postWasteLog = async (data) => {
  return api.post(`/logs`, data)
}

export const getUserLogs = async (userId) => {
  return api.get(`/logs/${userId}`)
}

export const getAllChallenges = async () => {
  return api.get(`/challenges`)
}

export const joinChallenge = async (challengeId) => {
  return api.post(`/challenges/${challengeId}/join`, {})
}

export const completeChallenge = async (challengeId) => {
  return api.post(`/challenges/${challengeId}/complete`, {})
}

export const createNewChallenge = async (data) => {
  return api.post(`/challenges`, data)
}

export const signup = async (data) => {
  return api.post(`/auth/signup`, data)
}

export const login = async (data) => {
  return api.post(`/auth/login`, data)
}

export const logoutUser = async () => {
  return api.post(`/auth/logout`)
}

export const getMe = async () => {
  return api.get(`/auth/me`)
}

export const getUserProfile = async (userId) => {
  return api.get(`/users/${userId}`)
}

export const getLeaderboard = async (period = "weekly") => {
  return api.get(`/leaderboard?period=${period}`)
}

export const getUserStats = async (userId) => {
  return api.get(`/users/${userId}/stats`)
}

// Community APIs
export const getCommunityPosts = async () => {
  return api.get(`/community`)
}

export const createCommunityPost = async (data) => {
  return api.post(`/community`, data)
}

export const toggleLikePost = async (postId) => {
  return api.post(`/community/${postId}/like`, {})
}

export const addComment = async (postId, content) => {
  return api.post(`/community/${postId}/comment`, { content })
}

export const deleteCommunityPost = async (postId) => {
  return api.delete(`/community/${postId}`)
}

export const getCommunityStats = async () => {
  return api.get(`/community/stats`)
}
