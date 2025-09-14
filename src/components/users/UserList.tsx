'use client'

import React, { useState, useEffect } from 'react'
import { Table, Card, Space, Tag, message, Button, Popconfirm, Modal } from 'antd'
import { UserOutlined, ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { UserResponse } from '@/lib/users/service'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface UserListProps {
  refreshTrigger?: number
  onEdit?: (user: UserResponse) => void
}

export default function UserList({ refreshTrigger, onEdit }: UserListProps) {
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

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })
      const result = await response.json()

      if (result.success) {
        message.success('删除用户成功')
        fetchUsers() // 重新获取用户列表
      } else {
        message.error(result.error || '删除用户失败')
      }
    } catch (error) {
      console.error('删除用户失败:', error)
      message.error('删除用户失败，请稍后重试')
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
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit?.(record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description={`确定要删除用户 "${record.username}" 吗？`}
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
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