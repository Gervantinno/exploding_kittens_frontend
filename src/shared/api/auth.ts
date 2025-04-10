import { setUserId } from '../utils/userId';
import { setUsername } from '../utils/username';
import { setToken } from '../utils/token';

export const API_URL = 'http://localhost:3000';

export const getTokenCall = async (username: string): Promise<string> => {
  const response = await fetch(`${API_URL}/auth/?username=${encodeURIComponent(username)}`);

  if (!response.ok) {
    throw new Error('Ошибка при получении токена');
  }

  const data = await response.json();
  setUserId(data.userId);
  return data.token;
};

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

export const registerCall = async (
  email: string,
  username: string,
  password: string
): Promise<any> => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Registration failed');
  }
  const data = await response.json();
  setToken(data.token);
  setUserId(data.userId);
  setUsername(data.username);
  return data;
};

export const loginCall = async (
  email: string,
  password: string
): Promise<{ token: string; userId: string; username: string }> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }

  const data = await response.json();
  setToken(data.token);
  setUserId(data.userId);
  setUsername(data.username);
  return data;
};
