'use client'

import React, { useState } from 'react'
import { Form, Input, Button, Card, message, Space } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import type { UserResponse } from '@/lib/users/service'

interface CreateUserFormProps {
  onSuccess?: (user: UserResponse) => void
}

interface FormData {
  username: string
  password: string
  confirmPassword: string
  email?: string
  name?: string
}

export default function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const [form] = Form.useForm<FormData>()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: FormData) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          email: values.email,
          name: values.name,
        }),
      })

      const result = await response.json()

      if (result.success) {
        message.success('用户创建成功')
        form.resetFields()
        onSuccess?.(result.data)
      } else {
        message.error(result.error || '创建用户失败')
      }
    } catch (error) {
      console.error('创建用户失败:', error)
      message.error('创建用户失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      title={
        <Space>
          <UserAddOutlined />
          创建新用户
        </Space>
      }
      style={{ maxWidth: 500, margin: '0 auto' }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            { required: true, message: '请输入用户名' },
            {
              pattern: /^[a-zA-Z0-9_]{3,20}$/,
              message: '用户名只能包含字母、数字、下划线，长度3-20位',
            },
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码长度至少6位' },
          ]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>

        <Form.Item
          label="确认密码"
          name="confirmPassword"
          rules={[
            { required: true, message: '请确认密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('两次输入的密码不一致'))
              },
            }),
          ]}
        >
          <Input.Password placeholder="请再次输入密码" />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            {
              type: 'email',
              message: '请输入有效的邮箱地址',
            },
          ]}
        >
          <Input placeholder="请输入邮箱（可选）" />
        </Form.Item>

        <Form.Item label="姓名" name="name">
          <Input placeholder="请输入姓名（可选）" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
          >
            创建用户
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}