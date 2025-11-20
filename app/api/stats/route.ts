import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import User from '@/models/User';
import Newsletter from '@/models/Newsletter';
import Testimonial from '@/models/Testimonial';
import { getCurrentUser } from '@/lib/auth';

// GET dashboard stats (PROTECTED)
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const [
      totalProducts,
      totalUsers,
      totalNewsletter,
      totalTestimonials,
      activeProducts,
      activeUsers,
    ] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Newsletter.countDocuments({ status: 'subscribed' }),
      Testimonial.countDocuments({ status: 'approved' }),
      Product.countDocuments({ status: 'active' }),
      User.countDocuments({ status: 'active' }),
    ]);
    
    const stats = {
      products: {
        total: totalProducts,
        active: activeProducts,
      },
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      newsletter: {
        total: totalNewsletter,
      },
      testimonials: {
        total: totalTestimonials,
      },
    };
    
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
