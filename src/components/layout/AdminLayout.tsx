'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  BookOutlined,
  DollarOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    setMounted(true);
    // 根据当前路径设置初始展开状态
    if (pathname.startsWith('/menu')) {
      setOpenKeys(['menu']);
    } else if (pathname.startsWith('/accounting')) {
      setOpenKeys(['accounting']);
    }
  }, [pathname]);

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
      onClick: () => {
        console.log('Navigating to home');
        router.push('/');
      },
    },
    {
      key: 'menu',
      icon: <BookOutlined />,
      label: '菜单管理',
      children: [
        {
          key: '/menu/list',
          icon: <UnorderedListOutlined />,
          label: '菜单列表',
          onClick: () => {
            console.log('Navigating to menu list');
            router.push('/menu/list');
          },
        },
        {
          key: '/menu/upload',
          icon: <PlusOutlined />,
          label: '添加菜谱',
          onClick: () => {
            console.log('Navigating to menu upload');
            router.push('/menu/upload');
          },
        },
      ],
    },
    {
      key: 'accounting',
      icon: <DollarOutlined />,
      label: '记账管理',
      children: [
        {
          key: '/accounting',
          icon: <BarChartOutlined />,
          label: '财务概览',
          onClick: () => {
            console.log('Navigating to accounting');
            router.push('/accounting');
          },
        },
      ],
    },
  ];

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    if (pathname === '/') return ['/'];
    if (pathname.startsWith('/menu')) return [pathname];
    if (pathname.startsWith('/accounting')) return ['/accounting'];
    return [];
  };



  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="flex items-center justify-center h-16">
          <h1 className={`text-white font-bold ${collapsed ? 'text-sm' : 'text-lg'}`}>
            {collapsed ? '家厨' : '家庭厨房管理'}
          </h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={mounted ? getSelectedKeys() : undefined}
          openKeys={mounted ? openKeys : undefined}
          onOpenChange={(keys) => setOpenKeys(keys)}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <h2 className="text-lg font-semibold text-gray-800 ml-4">
            家庭厨房管理系统
          </h2>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}