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

// Check if user is authenticated (via presence of user entity, token is handled securely via cookies)
export const isAuthenticated = () => {
  return !!getUser()
}

// Local storage clean up for front-end logout 
export const clearAuthStorage = () => {
  removeUser()
}
