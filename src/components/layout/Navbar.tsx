'use client'

import React from 'react'
import { Layout, Menu, Button, Space, Avatar, Dropdown, Typography } from 'antd'
import { UserOutlined, LogoutOutlined, HomeOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import type { MenuProps } from 'antd'

const { Header } = Layout
const { Text } = Typography

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
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

  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/recipes',
      icon: <BookOutlined />,
      label: '食谱管理',
    },
    {
      key: '/users',
      icon: <TeamOutlined />,
      label: '用户管理',
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key)
  }

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
            marginRight: '32px',
            cursor: 'pointer',
          }}
          onClick={() => router.push('/')}
        >
          家庭食谱管理系统
        </div>
        
        <Menu
          mode="horizontal"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            border: 'none',
            background: 'transparent',
            minWidth: '300px',
          }}
        />
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