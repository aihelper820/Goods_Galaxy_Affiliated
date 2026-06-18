import { NextResponse } from 'next/server';
import { getAllProducts, getProducts } from '@/lib/products';

export async function GET() {
  try {
    console.log('[DEBUG] Testing product fetching...');

    // Test 1: Get all products (admin view)
    console.log('[DEBUG] Fetching all products (admin view)...');
    const allProducts = await getAllProducts({ page: 1, per_page: 100 });
    console.log('[DEBUG] All products result:', {
      success: allProducts.success,
      total: allProducts.total,
      count: allProducts.data.length,
      products: allProducts.data.map(p => ({
        id: p.$id,
        title: p.title,
        is_published: p.is_published,
      })),
    });

    // Test 2: Get published products (frontend view)
    console.log('[DEBUG] Fetching published products (frontend view)...');
    const publishedProducts = await getProducts({ page: 1, per_page: 100 });
    console.log('[DEBUG] Published products result:', {
      success: publishedProducts.success,
      total: publishedProducts.total,
      count: publishedProducts.data.length,
      products: publishedProducts.data.map(p => ({
        id: p.$id,
        title: p.title,
        is_published: p.is_published,
      })),
    });

    return NextResponse.json({
      success: true,
      allProducts,
      publishedProducts,
    });
  } catch (error) {
    console.error('[DEBUG] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
