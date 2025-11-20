import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { getCurrentUser } from '@/lib/auth';

// GET all products
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
        ],
      };
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST create new product (PROTECTED)
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
    const product = await Product.create(body);
    
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
