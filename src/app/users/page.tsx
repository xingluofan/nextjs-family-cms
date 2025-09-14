'use client'

import React, { useState } from 'react'
import { Row, Col, Space, Typography } from 'antd'
import CreateUserForm from '@/components/users/CreateUserForm'
import UserList from '@/components/users/UserList'
import UserEditForm from '@/components/users/UserEditForm'
import type { UserResponse } from '@/lib/users/service'


const { Title } = Typography

export default function UsersPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null)
  const [editModalVisible, setEditModalVisible] = useState(false)

  const handleUserCreated = () => {
    // 触发用户列表刷新
    setRefreshTrigger(prev => prev + 1)
  }

  const handleEditUser = (user: UserResponse) => {
    setEditingUser(user)
    setEditModalVisible(true)
  }

  const handleEditSuccess = () => {
    setEditModalVisible(false)
    setEditingUser(null)
    setRefreshTrigger(prev => prev + 1)
  }

  const handleEditCancel = () => {
    setEditModalVisible(false)
    setEditingUser(null)
  }

  return (
    <div style={{ padding: '24px', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={2}>用户管理</Title>
          <p style={{ color: '#666', fontSize: '16px' }}>
            管理系统用户，创建新用户和查看用户列表
          </p>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <CreateUserForm onSuccess={handleUserCreated} />
          </Col>
          <Col xs={24} lg={16}>
            <UserList 
              refreshTrigger={refreshTrigger} 
              onEdit={handleEditUser}
            />
          </Col>
        </Row>

        <UserEditForm
          visible={editModalVisible}
          user={editingUser}
          onCancel={handleEditCancel}
          onSuccess={handleEditSuccess}
        />
      </Space>
    </div>
  )
}