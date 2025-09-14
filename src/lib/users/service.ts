import { prisma } from '../database/prisma'
import { hashPassword } from './auth'

export interface CreateUserData {
  username: string
  password: string
  email?: string
  name?: string
}

export interface UserResponse {
  id: number
  username: string
  email?: string | null
  name?: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * 创建用户
 * @param userData 用户数据
 * @returns 创建的用户信息（不包含密码）
 */
export async function createUser(userData: CreateUserData): Promise<UserResponse> {
  const { password, ...otherData } = userData
  
  // 加密密码
  const hashedPassword = await hashPassword(password)
  
  // 创建用户
  const user = await prisma.user.create({
    data: {
      ...otherData,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  
  return user
}

/**
 * 获取所有用户
 * @returns 用户列表（不包含密码）
 */
export async function getAllUsers(): Promise<UserResponse[]> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  
  return users
}

/**
 * 根据ID获取用户
 * @param id 用户ID
 * @returns 用户信息（不包含密码）
 */
export async function getUserById(id: number): Promise<UserResponse | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  
  return user
}

/**
 * 根据用户名获取用户
 * @param username 用户名
 * @returns 用户信息（不包含密码）
 */
export async function getUserByUsername(username: string): Promise<UserResponse | null> {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  
  return user
}

/**
 * 检查用户名是否已存在
 * @param username 用户名
 * @returns 是否存在
 */
export async function isUsernameExists(username: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  })
  
  return !!user
}

/**
 * 检查邮箱是否已存在
 * @param email 邮箱
 * @returns 是否存在
 */
export async function isEmailExists(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })
  
  return !!user
}