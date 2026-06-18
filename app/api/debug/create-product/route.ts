import { NextResponse } from 'next/server';
import { createProduct } from '@/lib/products';

export async function POST() {
  try {
    console.log('[TEST] Creating a test product...');
    
    const testProduct = {
      title: 'Test Product',
      slug: 'test-product',
      description: 'A test product',
      short_desc: 'Test',
      price: '29.99',
      original_price: '39.99',
      image_url: 'https://via.placeholder.com/300x300',
      amazon_url: 'https://amazon.com/dp/TEST123',
      category_id: '69e8396b4a2e3bfeff58',
      is_published: true,
      is_featured: false,
    };

    console.log('[TEST] Calling createProduct with:', testProduct);
    const result = await createProduct(testProduct);
    console.log('[TEST] Result:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[TEST] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
