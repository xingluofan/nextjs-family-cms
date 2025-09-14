import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import './globals.css'
import AppLayout from '@/components/common/AppLayout'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Family CMS',
  description: 'A family content management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AntdRegistry>
          <AuthProvider>
            <AppLayout>{children}</AppLayout>
          </AuthProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}