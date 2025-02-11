export type User = {
  id: number;
  username: string;
  password: string;
};

const users: { [key: number]: User } = {
  1: { id: 1, username: "user123", password: "pass456" },
};

let nextUserId = 2; // 사용자 ID 자동 증가

// 로그인 함수
export function authenticate(username: string, password: string): User | null {
  const user = Object.values(users).find(
    (u: User) => u.username === username && u.password === password
  );
  return user || null;
}

// 회원가입 함수 (테스트용: 콘솔에 바로 출력)
export function signup(username: string, password: string): User | null {
  // 중복 유저 확인
  if (Object.values(users).some((u) => u.username === username)) {
    console.log("❌ Username already exists");
    return null;
  }

  // 새로운 유저 생성
  const newUser: User = {
    id: nextUserId++, // 자동 증가 ID
    username,
    password,
  };

  users[newUser.id] = newUser; // users 객체에 추가
  console.log("✅ New user added:", newUser);
  console.log("📋 Current users:", users); // 현재 users 출력

  return newUser;
}
