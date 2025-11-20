import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Newsletter from '@/models/Newsletter';
import { getCurrentUser } from '@/lib/auth';

// GET all newsletter subscribers (PROTECTED)
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
        email: { $regex: search, $options: 'i' },
      };
    }
    
    const subscribers = await Newsletter.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: subscribers });
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

// POST subscribe to newsletter (PUBLIC - for user site)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Check if email already exists
    const existing = await Newsletter.findOne({ email: body.email });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Email already subscribed' },
        { status: 400 }
      );
    }
    
    const subscriber = await Newsletter.create(body);
    
    return NextResponse.json({ success: true, data: subscriber }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating newsletter subscription:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Email already subscribed' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
