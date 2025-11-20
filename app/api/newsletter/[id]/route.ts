import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Newsletter from '@/models/Newsletter';
import { getCurrentUser } from '@/lib/auth';

// GET single subscriber by ID (PROTECTED)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;
    
    const subscriber = await Newsletter.findById(id);
    
    if (!subscriber) {
      return NextResponse.json(
        { success: false, message: 'Subscriber not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: subscriber });
  } catch (error) {
    console.error('Error fetching subscriber:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch subscriber' },
      { status: 500 }
    );
  }
}

// PUT update subscriber (PROTECTED)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    const subscriber = await Newsletter.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!subscriber) {
      return NextResponse.json(
        { success: false, message: 'Subscriber not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: subscriber });
  } catch (error: any) {
    console.error('Error updating subscriber:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update subscriber' },
      { status: 500 }
    );
  }
}

// DELETE subscriber (PROTECTED)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;
    
    const subscriber = await Newsletter.findByIdAndDelete(id);
    
    if (!subscriber) {
      return NextResponse.json(
        { success: false, message: 'Subscriber not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Subscriber deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete subscriber' },
      { status: 500 }
    );
  }
}
