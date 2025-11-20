import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Testimonial from '@/models/Testimonial';
import { getCurrentUser } from '@/lib/auth';

// GET single testimonial by ID (PUBLIC)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const testimonial = await Testimonial.findById(id);
    
    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch testimonial' },
      { status: 500 }
    );
  }
}

// PUT update testimonial (PROTECTED)
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
    
    const testimonial = await Testimonial.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: testimonial });
  } catch (error: any) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

// DELETE testimonial (PROTECTED)
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
    
    const testimonial = await Testimonial.findByIdAndDelete(id);
    
    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}
