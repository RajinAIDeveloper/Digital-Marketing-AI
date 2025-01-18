// app/api/products/route.js
import { NextResponse } from "next/server";
import { db } from '@/db/drizzle';
import { eq } from "drizzle-orm";
import { products } from '@/db/schema';
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const productsList = await db
      .select()
      .from(products)
      .where(eq(products.sellerId, userId))
      .execute();

    return NextResponse.json(
      { 
        products: productsList,
        status: 'success' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST new product
export async function POST(req) {
  try {
    const productData = await req.json();

    // Validate required fields
    const requiredFields = ['sellerId', 'name', 'price', 'sellingPrice', 'quantity', 'unitCommission'];
    const missingFields = requiredFields.filter(field => !productData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Insert new product
    const newProduct = await db
      .insert(products)
      .values({
        sellerId: productData.sellerId,
        name: productData.name,
        image: productData.image || null,
        price: productData.price,
        sellingPrice: productData.sellingPrice,
        quantity: productData.quantity,
        unitCommission: productData.unitCommission,
        isActive: true
      })
      .returning()
      .execute();

    return NextResponse.json(
      { 
        product: newProduct[0],
        status: 'success' 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}