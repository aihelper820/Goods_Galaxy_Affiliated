import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query } from 'node-appwrite';
import { PaginatedResponse } from '@/lib/types';

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getDb() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');
  return new Databases(client);
}

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'affiliate_db';
const COLLECTION_ID = process.env.APPWRITE_PRODUCTS_COLLECTION_ID || 'products';
const CATEGORIES_COLLECTION_ID = process.env.APPWRITE_CATEGORIES_COLLECTION_ID || 'categories';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const searchParams = request.nextUrl.searchParams;

    const search = searchParams.get('search')?.trim() || undefined;
    const page = parsePositiveInt(searchParams.get('page'), 1);
    const perPage = parsePositiveInt(searchParams.get('per_page'), 12);
    const categorySlug = searchParams.get('category_slug')?.trim() || undefined;
    const offset = (page - 1) * perPage;

    const queries: string[] = [
      Query.equal('is_published', true),
      Query.limit(perPage),
      Query.offset(offset),
    ];

    if (search) {
      queries.push(Query.contains('title', search));
    }

    // Resolve category slug → ID if provided
    if (categorySlug) {
      const catResult = await db.listDocuments(DATABASE_ID, CATEGORIES_COLLECTION_ID, [
        Query.equal('slug', categorySlug),
        Query.equal('is_active', true),
        Query.limit(1),
      ]);
      if (catResult.documents.length === 0) {
        const empty: PaginatedResponse<never> = {
          success: true,
          data: [],
          total: 0,
          page,
          per_page: perPage,
          total_pages: 0,
        };
        return NextResponse.json(empty);
      }
      queries.push(Query.equal('category_id', catResult.documents[0].$id));
    }

    const response = await db.listDocuments(DATABASE_ID, COLLECTION_ID, queries);

    // Strip Appwrite internal fields to keep payload lean
    const data = response.documents.map((doc) => JSON.parse(JSON.stringify(doc)));

    const result: PaginatedResponse<(typeof data)[number]> = {
      success: true,
      data,
      total: response.total,
      page,
      per_page: perPage,
      total_pages: Math.ceil(response.total / perPage),
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[/api/products] Error:', error);
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
