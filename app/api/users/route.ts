import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { getCurrentUser } from '@/lib/auth';

// GET all users (PROTECTED)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      };
    }
    
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST create new user (PROTECTED)
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    
    // Hash password before creating user
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(body.password, salt);
    }
    
    const newUser = await User.create(body);
    
    // Remove password from response
    const userResponse = newUser.toObject();
    delete (userResponse as any).password;
    
    return NextResponse.json({ success: true, data: userResponse }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
