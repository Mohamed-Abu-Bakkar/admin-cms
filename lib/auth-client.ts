'use client';

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return data;
}

export async function logoutUser(): Promise<{ success: boolean }> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  });

  const data = await response.json();
  return data;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch('/api/auth/me');
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.user : null;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}
