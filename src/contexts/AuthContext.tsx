'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { message } from 'antd'
import { useRouter, usePathname } from 'next/navigation'

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
  const pathname = usePathname()

  // 处理401错误，跳转到登录页面
  const handle401Error = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚨 [AuthContext] 检测到401错误，处理未授权访问:', {
        currentPath: pathname,
        currentUser: user?.username,
        willRedirect: pathname !== '/login',
        timestamp: new Date().toISOString()
      })
    }
    
    setUser(null)
    if (typeof window !== 'undefined' && pathname !== '/login') {
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 [AuthContext] 重定向到登录页面:', {
          from: pathname,
          to: redirectUrl
        })
      }
      router.push(redirectUrl)
    }
  }

  // 检查用户是否已登录
  const checkAuth = async () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 [AuthContext] 开始检查认证状态:', {
        currentPath: pathname,
        timestamp: new Date().toISOString()
      })
    }
    
    try {
      const response = await fetch('/api/auth/me')
      if (process.env.NODE_ENV === 'development') {
        console.log('📡 [AuthContext] 认证API响应:', {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText
        })
      }
      
      if (response.ok) {
        const result = await response.json()
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ [AuthContext] 认证检查成功:', {
            success: result.success,
            user: result.data?.user?.username,
            userId: result.data?.user?.id
          })
        }
        
        if (result.success) {
          setUser(result.data.user)
          if (process.env.NODE_ENV === 'development') {
            console.log('👤 [AuthContext] 用户状态已更新:', result.data.user.username)
          }
        }
      } else if (response.status === 401) {
        if (process.env.NODE_ENV === 'development') {
          console.log('❌ [AuthContext] 认证失败，状态码401')
        }
        // 处理401错误
        handle401Error()
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('⚠️ [AuthContext] 认证检查异常状态:', response.status)
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('💥 [AuthContext] 检查认证状态失败:', error)
      }
    } finally {
      setLoading(false)
      if (process.env.NODE_ENV === 'development') {
        console.log('🏁 [AuthContext] 认证检查完成，loading状态已更新')
      }
    }
  }

  useEffect(() => {
    // 只在客户端设置全局fetch拦截器
    if (typeof window !== 'undefined') {
      const originalFetch = window.fetch
      const interceptedFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const response = await originalFetch(input, init)
        if (response.status === 401) {
          handle401Error()
        }
        return response
      }
      
      // 设置全局fetch拦截器
      window.fetch = interceptedFetch
      
      // 清理函数
      return () => {
        window.fetch = originalFetch
      }
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 [AuthContext] 开始登录流程:', {
        username,
        timestamp: new Date().toISOString()
      })
    }
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (process.env.NODE_ENV === 'development') {
        console.log('📡 [AuthContext] 登录API响应:', {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText
        })
      }

      const result = await response.json()
      if (process.env.NODE_ENV === 'development') {
        console.log('📋 [AuthContext] 登录响应数据:', {
          success: result.success,
          hasUser: !!result.data?.user,
          username: result.data?.user?.username,
          error: result.error
        })
      }

      if (response.ok && result.success) {
        setUser(result.data.user)
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ [AuthContext] 登录成功，用户状态已更新:', result.data.user.username)
        }
        message.success('登录成功')
        return true
      } else {
        // 处理所有错误情况，包括500错误
        if (process.env.NODE_ENV === 'development') {
          console.log('❌ [AuthContext] 登录失败:', {
            status: response.status,
            error: result.error || '登录失败'
          })
        }
        message.error(result.error || '登录失败')
        return false
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('💥 [AuthContext] 登录异常:', error)
      }
      message.error('登录失败，请稍后重试')
      return false
    }
  }

  const logout = async () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚪 [AuthContext] 开始退出登录流程:', {
        currentUser: user?.username,
        timestamp: new Date().toISOString()
      })
    }
    
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📡 [AuthContext] 退出登录API响应:', {
          status: response.status,
          ok: response.ok
        })
      }
      
      setUser(null)
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ [AuthContext] 用户状态已清除，退出登录成功')
      }
      message.success('已退出登录')
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('💥 [AuthContext] 退出登录异常:', error)
      }
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