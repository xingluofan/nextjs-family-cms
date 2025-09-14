'use client'

import React from 'react'
import { Card, Row, Col, Typography, Space } from 'antd'
import { UserOutlined, MenuOutlined, DollarOutlined, PlusOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

const { Title, Paragraph } = Typography

const moduleCards = [
  {
    key: '/users',
    icon: <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
    title: '用户管理',
    description: '管理系统用户，创建和查看用户信息',
  },
  {
    key: '/menu',
    icon: <MenuOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
    title: '菜单管理',
    description: '管理家庭菜谱和做菜计划',
  },
  {
    key: '/finance',
    icon: <DollarOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
    title: '收支管理',
    description: '管理家庭收入和支出记录',
  },
  {
    key: '/more',
    icon: <PlusOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
    title: '更多模块',
    description: '更多功能模块即将上线',
    disabled: true,
  },
]

export default function Home() {
  const router = useRouter()

  const handleCardClick = (key: string, disabled?: boolean) => {
    if (!disabled) {
      router.push(key)
    }
  }

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={2}>欢迎使用 Family CMS</Title>
          <Paragraph style={{ fontSize: '16px', color: '#666' }}>
            一个简单易用的家庭内容管理系统，帮助您管理日常生活的各个方面
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {moduleCards.map((card) => (
            <Col xs={24} sm={12} lg={6} key={card.key}>
              <Card
                hoverable={!card.disabled}
                style={{
                  textAlign: 'center',
                  height: '200px',
                  cursor: card.disabled ? 'not-allowed' : 'pointer',
                  opacity: card.disabled ? 0.6 : 1,
                }}
                onClick={() => handleCardClick(card.key, card.disabled)}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  {card.icon}
                  <Title level={4} style={{ margin: 0 }}>
                    {card.title}
                  </Title>
                  <Paragraph style={{ margin: 0, color: '#666' }}>
                    {card.description}
                  </Paragraph>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Space>
    </div>
  )
}