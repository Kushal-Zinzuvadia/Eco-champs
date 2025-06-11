import axios from "axios"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export const postWasteLog = async (data, token) => {
  return axios.post(`${API_BASE}/logs`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const getUserLogs = async (userId, token) => {
  return axios.get(`${API_BASE}/logs/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const getAllChallenges = async (token) => {
  return axios.get(`${API_BASE}/challenges`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const joinChallenge = async (challengeId, token) => {
  return axios.post(
    `${API_BASE}/challenges/join/${challengeId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
}

export const completeChallenge = async (challengeId, token) => {
  return axios.post(
    `${API_BASE}/challenges/${challengeId}/complete`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
}

export const signup = async (data) => {
  return axios.post(`${API_BASE}/auth/signup`, data)
}

export const login = async (data) => {
  return axios.post(`${API_BASE}/auth/login`, data)
}

export const getUserProfile = async (userId, token) => {
  return axios.get(`${API_BASE}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const getLeaderboard = async (period = "weekly", token) => {
  return axios.get(`${API_BASE}/leaderboard?period=${period}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const getUserStats = async (userId, token) => {
  return axios.get(`${API_BASE}/users/${userId}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
