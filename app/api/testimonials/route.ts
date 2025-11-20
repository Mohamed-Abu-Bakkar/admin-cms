import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Testimonial from '@/models/Testimonial';
import { getCurrentUser } from '@/lib/auth';

// GET all testimonials (PUBLIC)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'approved';
    
    // Public endpoint only returns approved testimonials by default
    const query = status === 'all' ? {} : { status };
    
    const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST create new testimonial (PROTECTED)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    const testimonial = await Testimonial.create(body);
    
    return NextResponse.json({ success: true, data: testimonial }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}
