'use client'

import React, { useState, useEffect } from 'react'
import { Table, Card, Space, Tag, message, Button } from 'antd'
import { UserOutlined, ReloadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { UserResponse } from '@/lib/users/service'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface UserListProps {
  refreshTrigger?: number
}

export default function UserList({ refreshTrigger }: UserListProps) {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/users')
      const result = await response.json()

      if (result.success) {
        setUsers(result.data)
      } else {
        message.error(result.error || '获取用户列表失败')
      }
    } catch (error) {
      console.error('获取用户列表失败:', error)
      message.error('获取用户列表失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [refreshTrigger])

  const columns: ColumnsType<UserResponse> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (username: string) => (
        <Space>
          <UserOutlined />
          <strong>{username}</strong>
        </Space>
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (name: string | null) => name || <Tag color="default">未设置</Tag>,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (email: string | null) => email || <Tag color="default">未设置</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => {
        const date = new Date(createdAt)
        return (
          <span title={format(date, 'yyyy-MM-dd HH:mm:ss', { locale: zhCN })}>
            {format(date, 'yyyy-MM-dd', { locale: zhCN })}
          </span>
        )
      },
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt: string) => {
        const date = new Date(updatedAt)
        return (
          <span title={format(date, 'yyyy-MM-dd HH:mm:ss', { locale: zhCN })}>
            {format(date, 'yyyy-MM-dd', { locale: zhCN })}
          </span>
        )
      },
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
  ]

  return (
    <Card
      title={
        <Space>
          <UserOutlined />
          用户列表
          <Tag color="blue">{users.length} 个用户</Tag>
        </Space>
      }
      extra={
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchUsers}
          loading={loading}
        >
          刷新
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
        }}
        scroll={{ x: 800 }}
      />
    </Card>
  )
}