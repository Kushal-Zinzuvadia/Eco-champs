// Helper functions for authentication

// Store token in localStorage
export const setToken = (token) => {
  localStorage.setItem("ecoChamps_token", token)
}

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem("ecoChamps_token")
}

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem("ecoChamps_token")
}

// Store user data in localStorage
export const setUser = (user) => {
  localStorage.setItem("ecoChamps_user", JSON.stringify(user))
}

// Get user data from localStorage
export const getUser = () => {
  const user = localStorage.getItem("ecoChamps_user")
  return user ? JSON.parse(user) : null
}

// Remove user data from localStorage
export const removeUser = () => {
  localStorage.removeItem("ecoChamps_user")
}

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken()
}

// Logout user
export const logout = () => {
  removeToken()
  removeUser()
}
