export const API_URL = 'http://localhost:3000';

export const getToken = async (username: string): Promise<string> => {
  const response = await fetch(`${API_URL}/auth/?username=${encodeURIComponent(username)}`);

  if (!response.ok) {
    throw new Error('Ошибка при получении токена');
  }

  const data = await response.json();
  localStorage.setItem('userId', data.userId);
  return data.token;
};

// src/shared/utils/auth.ts
export function getAuthInfo() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      userId: payload.userId,
      username: payload.username,
    };
  } catch {
    return null;
  }
}
