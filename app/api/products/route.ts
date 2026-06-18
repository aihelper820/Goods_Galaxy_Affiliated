import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getProductsByCategory } from '@/lib/products';
import { Product, PaginatedResponse } from '@/lib/types';

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export async function GET(request: NextRequest): Promise<NextResponse<PaginatedResponse<Product>>> {
  try {
    const searchParams = request.nextUrl.searchParams;

    const search = searchParams.get('search')?.trim() || undefined;
    const page = parsePositiveInt(searchParams.get('page'), 1);
    const perPage = parsePositiveInt(searchParams.get('per_page'), 12);
    const categorySlug = searchParams.get('category_slug')?.trim() || undefined;

    if (categorySlug) {
      const response = await getProductsByCategory(categorySlug, {
        search,
        page,
        per_page: perPage,
      });
      return NextResponse.json(response, { status: 200 });
    }

    const response = await getProducts({
      search,
      page,
      per_page: perPage,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: [],
        total: 0,
        page: 1,
        per_page: 12,
        total_pages: 0,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}
