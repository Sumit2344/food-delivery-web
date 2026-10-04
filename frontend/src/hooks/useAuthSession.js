import { useEffect, useState } from 'react'
import { getCurrentUser } from '../services/api'

const AUTH_EVENT = 'tomato-auth-change'

export function saveAuthSession({ token, user }) {
  localStorage.setItem('tomato_token', token)
  localStorage.setItem('tomato_user', JSON.stringify(user))
  localStorage.setItem('auth', 'true')
  window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: user }))
}

export function clearAuthSession() {
  localStorage.removeItem('tomato_token')
  localStorage.removeItem('tomato_user')
  localStorage.removeItem('auth')
  window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: null }))
}

export default function useAuthSession() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    let active = true
    const validateSavedSession = () => {
      const token = localStorage.getItem('tomato_token')
      if (!token) {
        setUser(null)
        return
      }

      getCurrentUser(token)
        .then(({ user: currentUser }) => {
          if (active && localStorage.getItem('tomato_token') === token) setUser(currentUser)
        })
        .catch((error) => {
          if (!active || localStorage.getItem('tomato_token') !== token) return
          if (error.status === 401) clearAuthSession()
          else console.error('Unable to validate the saved sign-in session', error)
        })
    }
    const handleAuthChange = (event) => setUser(event.detail)
    const handleStorage = (event) => {
      if (event.key === 'tomato_token' || event.key === 'tomato_user') {
        validateSavedSession()
      }
    }

    window.addEventListener(AUTH_EVENT, handleAuthChange)
    window.addEventListener('storage', handleStorage)

    validateSavedSession()

    return () => {
      active = false
      window.removeEventListener(AUTH_EVENT, handleAuthChange)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  return { user, loggedIn: Boolean(user), logout: clearAuthSession }
}
