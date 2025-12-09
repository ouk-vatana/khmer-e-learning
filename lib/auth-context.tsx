"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "educator" | "student"

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  photo?: string
  bio?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate checking if user is logged in (from localStorage or API)
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate login (in real app, call API)
    // Try to find user in stored users, otherwise create a test user
    const users = localStorage.getItem("komplex_users")
    let mockUser: User
    
    if (users) {
      try {
        const usersArray = JSON.parse(users)
        const foundUser = usersArray.find((u: User) => u.email === email)
        if (foundUser) {
          mockUser = foundUser
        } else {
          mockUser = {
            id: Date.now().toString(),
            email,
            fullName: email.split("@")[0],
            role: "student",
          }
          usersArray.push(mockUser)
          localStorage.setItem("komplex_users", JSON.stringify(usersArray))
        }
      } catch {
        mockUser = {
          id: Date.now().toString(),
          email,
          fullName: email.split("@")[0],
          role: "student",
        }
      }
    } else {
      mockUser = {
        id: Date.now().toString(),
        email,
        fullName: email.split("@")[0],
        role: "student",
      }
      localStorage.setItem("komplex_users", JSON.stringify([mockUser]))
    }
    
    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
  }

  const signup = async (email: string, password: string, fullName: string, role: UserRole) => {
    // Simulate signup (in real app, call API)
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      fullName,
      role,
    }
    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
    
    // Store user in users list for student management
    const users = localStorage.getItem("komplex_users")
    const usersArray = users ? JSON.parse(users) : []
    usersArray.push(mockUser)
    localStorage.setItem("komplex_users", JSON.stringify(usersArray))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
