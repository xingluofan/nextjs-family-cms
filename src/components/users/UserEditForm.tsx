'use client'

import React, { useEffect } from 'react'
import { Modal, Form, Input, message } from 'antd'
import type { UserResponse, UpdateUserData } from '@/lib/users/service'

interface UserEditFormProps {
  visible: boolean
  user: UserResponse | null
  onCancel: () => void
  onSuccess: () => void
}

export default function UserEditForm({ visible, user, onCancel, onSuccess }: UserEditFormProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (visible && user) {
      form.setFieldsValue({
        username: user.username,
        name: user.name || '',
        email: user.email || '',
      })
    }
  }, [visible, user, form])

  const handleSubmit = async (values: {
    username: string
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }) => {
    if (!user) return

    try {
      const updateData: UpdateUserData = {
        username: values.username,
        name: values.name || undefined,
        email: values.email || undefined,
      }

      // 如果提供了新密码，则包含在更新数据中
      if (values.password) {
        updateData.password = values.password
      }

      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (result.success) {
        message.success('更新用户成功')
        form.resetFields()
        onSuccess()
      } else {
        message.error(result.error || '更新用户失败')
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('更新用户失败:', error)
      }
      message.error('更新失败，请重试')
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      title="编辑用户"
      open={visible}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="保存"
      cancelText="取消"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        preserve={false}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 3, message: '用户名至少3个字符' },
            { max: 20, message: '用户名最多20个字符' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' },
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item
          label="姓名"
          name="name"
          rules={[
            { max: 50, message: '姓名最多50个字符' },
          ]}
        >
          <Input placeholder="请输入姓名（可选）" />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { type: 'email', message: '请输入有效的邮箱地址' },
            { max: 100, message: '邮箱最多100个字符' },
          ]}
        >
          <Input placeholder="请输入邮箱（可选）" />
        </Form.Item>

        <Form.Item
          label="新密码"
          name="password"
          rules={[
            { min: 6, message: '密码至少6个字符' },
            { max: 100, message: '密码最多100个字符' },
          ]}
          extra="留空则不修改密码"
        >
          <Input.Password placeholder="请输入新密码（可选）" />
        </Form.Item>

        <Form.Item
          label="确认新密码"
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                const password = getFieldValue('password')
                if (!password && !value) {
                  return Promise.resolve()
                }
                if (!value) {
                  return Promise.reject(new Error('请确认新密码'))
                }
                if (password !== value) {
                  return Promise.reject(new Error('两次输入的密码不一致'))
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <Input.Password placeholder="请再次输入新密码" />
        </Form.Item>
      </Form>
    </Modal>
  )
}