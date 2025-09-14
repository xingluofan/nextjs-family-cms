'use client'

import React from 'react'
import { Typography, Card, Space } from 'antd'
import { MenuOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export default function MenuPage() {
  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>
            <MenuOutlined style={{ marginRight: 8 }} />
            菜单管理
          </Title>
          <Text type="secondary">管理家庭菜单和食谱安排</Text>
        </div>
        
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <MenuOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <Title level={3}>菜单管理功能</Title>
            <Text type="secondary">此功能正在开发中，敬请期待...</Text>
          </div>
        </Card>
      </Space>
    </div>
  )
}