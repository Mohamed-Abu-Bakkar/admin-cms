import { cookies } from 'next/headers';
import { connectDB } from './db';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

export interface UserType {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  user?: UserType;
  token?: string;
  message?: string;
}

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return new TextEncoder().encode(secret);
};

export async function verifyCredentials(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    await connectDB();

    const user = await User.findOne({
      email: email.toLowerCase(),
      status: 'active'
    });

    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    // Generate token
    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(getJwtSecretKey());

    return {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  } catch (error) {
    console.error('Error verifying credentials:', error);
    return {
      success: false,
      message: 'An error occurred during login',
    };
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('auth-token')?.value;
}

export async function getCurrentUser(): Promise<UserType | null> {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  try {
    // Verify the token
    const { payload } = await jwtVerify(token, getJwtSecretKey());

    if (!payload.userId || typeof payload.userId !== 'string') {
      console.log('Invalid token payload');
      return null;
    }

    await connectDB();
    const user = await User.findById(payload.userId).select('-password');

    if (!user || user.status !== 'active') {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}
