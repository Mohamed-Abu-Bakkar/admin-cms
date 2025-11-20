import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { getCurrentUser } from '@/lib/auth';

// GET single user by ID (PROTECTED)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT update user (PROTECTED)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    // If password is being updated, hash it
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(body.password, salt);
    }
    
    const user = await User.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error('Error updating user:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE user (PROTECTED)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;
    
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
