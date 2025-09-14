'use client'

import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Card, Typography, Space } from 'antd'
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

const { Title, Text } = Typography

interface LoginFormData {
  username: string
  password: string
}

export default function LoginPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/'
  const { login, isAuthenticated } = useAuth()

  // 如果已经登录，直接跳转
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectPath)
    }
  }, [isAuthenticated, router, redirectPath])

  const handleLogin = async (values: LoginFormData) => {
    setLoading(true)
    try {
      const success = await login(values.username, values.password)
      if (success) {
        // 登录成功后，isAuthenticated状态会更新，useEffect会处理跳转
        // 不需要手动跳转，让useEffect来处理
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('登录过程中发生错误:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <div>
            <LoginOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <Title level={2} style={{ margin: 0, color: '#262626' }}>
              家庭食谱管理系统
            </Title>
            <Text type="secondary">请登录您的账户</Text>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            size="large"
            style={{ width: '100%' }}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3个字符' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  width: '100%',
                  height: '44px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 500,
                }}
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              还没有账户？请联系管理员创建账户
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  )
}