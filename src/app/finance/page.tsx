'use client'

import React from 'react'
import { Typography, Card, Space } from 'antd'
import { DollarOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export default function FinancePage() {
  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>
            <DollarOutlined style={{ marginRight: 8 }} />
            收支管理
          </Title>
          <Text type="secondary">管理家庭收入和支出记录</Text>
        </div>
        
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <DollarOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
            <Title level={3}>收支管理功能</Title>
            <Text type="secondary">此功能正在开发中，敬请期待...</Text>
          </div>
        </Card>
      </Space>
    </div>
  )
}