import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { authHelpers } from '../utils/firebase/auth'
import type { User, SignUpData, SignInData } from '../types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: SignUpData) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

// Remove RegisterData interface as we now use SignUpData from types

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = authHelpers.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await authHelpers.signIn({ email, password })
      
      if (error) {
        throw new Error(error)
      }
      
      if (data?.user) {
        setUser(data.user)
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: SignUpData) => {
    try {
      setLoading(true)
      const { data, error } = await authHelpers.signUp(userData)
      
      if (error) {
        throw new Error(error)
      }
      
      if (data?.user) {
        setUser(data.user)
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authHelpers.signOut()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


