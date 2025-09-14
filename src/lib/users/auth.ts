import bcrypt from 'bcryptjs'

/**
 * 加密密码
 * @param password 明文密码
 * @returns 加密后的密码
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

/**
 * 验证密码
 * @param password 明文密码
 * @param hashedPassword 加密后的密码
 * @returns 是否匹配
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

/**
 * 验证用户名格式
 * @param username 用户名
 * @returns 是否有效
 */
export function validateUsername(username: string): boolean {
  // 用户名长度3-20位，只能包含字母、数字、下划线
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

/**
 * 验证密码格式
 * @param password 密码
 * @returns 是否有效
 */
export function validatePassword(password: string): boolean {
  // 密码长度至少6位
  return password.length >= 6
}

/**
 * 验证邮箱格式
 * @param email 邮箱
 * @returns 是否有效
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}