export type User = {
  id: string
  username: string
}

const users: { [key: string]: User } = {
  user123: { id: "user123", username: "user123" },
}

// This is a mock authentication function
// In a real application, this would typically involve checking against a database or calling an API
export function authenticate(username: string, password: string): User | null {
  const user = Object.values(users).find((u) => u.username === username)
  if (user && users[user.id].username === username) {
    return user
  }
  return null
}

export async function signup(username: string, password: string): Promise<User | null> {
  if (Object.values(users).some((u) => u.username === username)) {
    return null // Username already exists
  }
  const newUser: User = { id: `user${Date.now()}`, username }
  users[newUser.id] = newUser
  return newUser
}

