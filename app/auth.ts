const users: { [key: string]: string } = {
  user123: "pass456",
}

// This is a mock authentication function
// In a real application, this would typically involve checking against a database or calling an API
export function authenticate(username: string, password: string): boolean {
  return users[username] === password
}

export async function signup(username: string, password: string): Promise<boolean> {
  // In a real application, you would hash the password before storing it
  if (users[username]) {
    return false // Username already exists
  }
  users[username] = password
  return true
}

