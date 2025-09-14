'use client'

import React from 'react'
import { Layout, Menu, Button, Space, Avatar, Dropdown, Typography } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import type { MenuProps } from 'antd'

const { Header } = Layout
const { Text } = Typography

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚪 [Navbar] 用户点击退出登录按钮:', {
        user: user?.username,
        timestamp: new Date().toISOString()
      })
    }
    
    try {
      await logout()
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 [Navbar] 退出登录完成，准备跳转到登录页')
      }
      router.push('/login')
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ [Navbar] 跳转到登录页命令已发送')
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ [Navbar] 退出登录流程异常:', error)
      }
    }
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: (
        <div>
          <div style={{ fontWeight: 'bold' }}>{user?.username}</div>
          {user?.name && <div style={{ fontSize: '12px', color: '#666' }}>{user.name}</div>}
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ]

  // 移除顶部重复的菜单项，只保留左侧导航

  if (!isAuthenticated) {
    return null // 未登录时不显示导航栏
  }

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1890ff',
            cursor: 'pointer',
          }}
          onClick={() => {
            if (process.env.NODE_ENV === 'development') {
              console.log('🏠 [Navbar] 用户点击系统标题，跳转到首页:', {
                user: user?.username,
                timestamp: new Date().toISOString()
              })
            }
            router.push('/')
          }}
        >
          家庭食谱管理系统
        </div>
      </div>

      <Space>
        <Text type="secondary">欢迎回来，</Text>
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button
            type="text"
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 'auto',
              padding: '4px 8px',
            }}
          >
            <Space>
              <Avatar size="small" icon={<UserOutlined />} />
              <span style={{ fontWeight: 500 }}>{user?.username}</span>
            </Space>
          </Button>
        </Dropdown>
      </Space>
    </Header>
  )
}