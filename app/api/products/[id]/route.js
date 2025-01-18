// app/api/products/[id]/route.js

// PUT (update) product
export async function PUT(req, { params }) {
    try {
      const productId = params.id;
      const updates = await req.json();
  
      // Validate product exists
      const existingProduct = await db
        .select()
        .from(products)
        .where(eq(products.id, parseInt(productId)))
        .execute();
  
      if (!existingProduct || existingProduct.length === 0) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
  
      // Update product
      const updatedProduct = await db
        .update(products)
        .set({
          name: updates.name,
          image: updates.image,
          price: updates.price,
          sellingPrice: updates.sellingPrice,
          quantity: updates.quantity,
          unitCommission: updates.unitCommission,
          updatedAt: new Date()
        })
        .where(eq(products.id, parseInt(productId)))
        .returning()
        .execute();
  
      return NextResponse.json(
        { 
          product: updatedProduct[0],
          status: 'success' 
        },
        { status: 200 }
      );
  
    } catch (error) {
      console.error('Error updating product:', error);
      return NextResponse.json(
        { 
          error: 'Internal server error',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }
  }
  
  // DELETE product
  export async function DELETE(req, { params }) {
    try {
      const productId = params.id;
  
      // Instead of hard deleting, we set isActive to false
      const deactivatedProduct = await db
        .update(products)
        .set({
          isActive: false,
          updatedAt: new Date()
        })
        .where(eq(products.id, parseInt(productId)))
        .returning()
        .execute();
  
      if (!deactivatedProduct || deactivatedProduct.length === 0) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { 
          status: 'success',
          message: 'Product successfully deactivated'
        },
        { status: 200 }
      );
  
    } catch (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json(
        { 
          error: 'Internal server error',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }
  }