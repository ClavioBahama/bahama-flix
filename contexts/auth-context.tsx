"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simular autenticação
    // Em produção, isso seria uma chamada para API

    // Credenciais de administrador
    if (email === "admin@bahamaflix.com" && password === "admin123") {
      const adminUser: User = {
        id: "admin",
        name: "Administrador",
        email: "admin@bahamaflix.com",
        isAdmin: true,
      }
      setUser(adminUser)
      localStorage.setItem("currentUser", JSON.stringify(adminUser))
      return true
    }

    // Credenciais de usuário normal
    if (email === "user@example.com" && password === "user123") {
      const normalUser: User = {
        id: "user1",
        name: "Usuário",
        email: "user@example.com",
        isAdmin: false,
      }
      setUser(normalUser)
      localStorage.setItem("currentUser", JSON.stringify(normalUser))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin: user?.isAdmin || false,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
