'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { message } from 'antd'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  username: string
  name?: string | null
  email?: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // 处理401错误，跳转到登录页面
  const handle401Error = () => {
    setUser(null)
    const currentPath = window.location.pathname
    if (currentPath !== '/login') {
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
    }
  }

  // 检查用户是否已登录
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setUser(result.data.user)
        }
      } else if (response.status === 401) {
        // 处理401错误
        handle401Error()
      }
    } catch (error) {
      console.error('检查认证状态失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 全局fetch拦截器
  const originalFetch = window.fetch
  const interceptedFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await originalFetch(input, init)
    if (response.status === 401) {
      handle401Error()
    }
    return response
  }

  useEffect(() => {
    // 设置全局fetch拦截器
    window.fetch = interceptedFetch
    checkAuth()
    
    // 清理函数
    return () => {
      window.fetch = originalFetch
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setUser(result.data.user)
        message.success('登录成功')
        return true
      } else {
        // 处理所有错误情况，包括500错误
        message.error(result.error || '登录失败')
        return false
      }
    } catch (error) {
      console.error('登录失败:', error)
      message.error('登录失败，请稍后重试')
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      setUser(null)
      message.success('已退出登录')
    } catch (error) {
      console.error('退出登录失败:', error)
      message.error('退出登录失败')
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}