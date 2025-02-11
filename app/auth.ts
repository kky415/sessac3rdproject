export type User = {
  id: string
  username: string
}

const users: { [key: string]: User } = {
  user123: { id: "user123", username: "user123" },
}

// This is a mock authentication function
// In a real application, this would typically involve checking against a database or calling an API
export const authenticate = async (username: string, password: string) => {
  // 실제 인증 로직 구현
  if (username === "test" && password === "test123") {
    return true
  }
  return false
}

export const register = async (username: string, password: string) => {
  // 실제 회원가입 로직 구현
  if (username && password) {
    // 비밀번호 검증 로직 추가
    if (password.length >= 6) {
      return true
    }
  }
  return false
}

export const resetPassword = async (username: string, password: string) => {
  // 비밀번호 재설정 로직 구현
  if (username && password.length >= 6) {
    return true
  }
  return false
}

export async function signup(username: string, password: string): Promise<User | null> {
  if (Object.values(users).some((u) => u.username === username)) {
    return null // Username already exists
  }
  const newUser: User = { id: `user${Date.now()}`, username }
  users[newUser.id] = newUser
  return newUser
}

