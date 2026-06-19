/**
 * Products Module
 * CRUD operations for products
 */

import 'server-only'
import { databases } from './appwrite-server'
import { Query } from 'node-appwrite'
import { serializeDocument } from './utils'
import { Product, ProductFormData, ProductFilters, PaginatedResponse, ApiResponse } from './types'

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'affiliate_db'
const COLLECTION_ID = process.env.APPWRITE_PRODUCTS_COLLECTION_ID || 'products'

interface ProductCategoryDocument {
  category_id?: string
}

interface CategoryCountDocument {
  product_count?: number
}

/**
 * Generate URL-safe slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

/**
 * Get paginated products with optional filters
 */
export async function getProducts(
  filters?: ProductFilters
): Promise<PaginatedResponse<Product>> {
  try {
    const page = filters?.page || 1
    const perPage = filters?.per_page || 12
    const offset = (page - 1) * perPage

    const queries = [
      Query.equal('is_published', true),
    ]

    // Category filter
    if (filters?.category_id) {
      queries.push(Query.equal('category_id', filters.category_id))
    }

    // Featured filter
    if (filters?.is_featured !== undefined) {
      queries.push(Query.equal('is_featured', filters.is_featured))
    }

    // Search by title
    if (filters?.search) {
      queries.push(Query.contains('title', filters.search))
    }

    queries.push(Query.limit(perPage))
    queries.push(Query.offset(offset))

    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, queries)

    // Directly use paginated documents
    const paginatedDocs = response.documents.map((doc) => serializeDocument(doc)) as unknown as Product[]

    return {
      success: true,
      data: paginatedDocs,
      total: response.total,
      page,
      per_page: perPage,
      total_pages: Math.ceil(response.total / perPage),
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      total: 0,
      page: 1,
      per_page: 12,
      total_pages: 0,
      error: error instanceof Error ? error.message : 'Failed to fetch products',
    }
  }
}

/**
 * Get all products (admin view - includes unpublished)
 */
export async function getAllProducts(
  filters?: ProductFilters
): Promise<PaginatedResponse<Product>> {
  try {
    const page = filters?.page || 1
    const perPage = filters?.per_page || 12
    const offset = (page - 1) * perPage

    const queries: string[] = []

    // Category filter
    if (filters?.category_id) {
      queries.push(Query.equal('category_id', filters.category_id))
    }

    // Featured filter
    if (filters?.is_featured !== undefined) {
      queries.push(Query.equal('is_featured', filters.is_featured))
    }

    // Search by title
    if (filters?.search) {
      queries.push(Query.contains('title', filters.search))
    }

    queries.push(Query.limit(perPage))
    queries.push(Query.offset(offset))

    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, queries)

    // Directly use paginated documents
    const paginatedDocs = response.documents.map((doc) => serializeDocument(doc)) as unknown as Product[]

    return {
      success: true,
      data: paginatedDocs,
      total: response.total,
      page,
      per_page: perPage,
      total_pages: Math.ceil(response.total / perPage),
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      total: 0,
      page: 1,
      per_page: 12,
      total_pages: 0,
      error: error instanceof Error ? error.message : 'Failed to fetch products',
    }
  }
}

/**
 * Get most recent products (for dashboard activity)
 */
export async function getRecentProducts(limit: number = 5): Promise<Product[]> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc('$updatedAt'),
      Query.limit(limit),
    ])

    return response.documents.map((doc) => serializeDocument(doc)) as unknown as Product[]
  } catch {
    return []
  }
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit: number = 4): Promise<Product[]> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('is_featured', true),
      Query.equal('is_published', true),
      Query.limit(limit),
    ])

    return response.documents.map((doc) => serializeDocument(doc)) as unknown as Product[]
  } catch {
    return []
  }
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id)
    return serializeDocument(response) as unknown as Product
  } catch {
    return null
  }
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('slug', slug),
    ])

    if (response.documents.length === 0) return null
    return serializeDocument(response.documents[0]) as unknown as Product
  } catch {
    return null
  }
}

/**
 * Get products by category slug
 * Resolves the slug to the category's Appwrite document ID before filtering.
 */
export async function getProductsByCategory(
  categorySlug: string,
  filters?: ProductFilters
): Promise<PaginatedResponse<Product>> {
  try {
    // First resolve the slug to a category ID
    const { getCategoryBySlug } = await import('./categories')
    const category = await getCategoryBySlug(categorySlug)

    if (!category) {
      return {
        success: true,
        data: [],
        total: 0,
        page: 1,
        per_page: 12,
        total_pages: 0,
      }
    }

    const page = filters?.page || 1
    const perPage = filters?.per_page || 12
    const offset = (page - 1) * perPage

    const queries = [
      Query.equal('is_published', true),
      Query.equal('category_id', category.$id),
      Query.limit(perPage),
      Query.offset(offset),
    ]

    // Search by title
    if (filters?.search) {
      queries.push(Query.contains('title', filters.search))
    }

    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, queries)

    return {
      success: true,
      data: response.documents.map((doc) => serializeDocument(doc)) as unknown as Product[],
      total: response.total,
      page,
      per_page: perPage,
      total_pages: Math.ceil(response.total / perPage),
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      total: 0,
      page: 1,
      per_page: 12,
      total_pages: 0,
      error: error instanceof Error ? error.message : 'Failed to fetch products',
    }
  }
}

/**
 * Create product (admin only)
 */
export async function createProduct(data: ProductFormData): Promise<ApiResponse<Product>> {
  try {
    console.log('[createProduct] Input data:', {
      title: data.title,
      slug: data.slug,
      category_id: data.category_id,
      price: data.price,
      is_published: data.is_published,
    });

    const productData = {
      title: data.title,
      slug: data.slug || generateSlug(data.title),
      description: data.description,
      short_desc: data.short_desc,
      price: data.price,
      original_price: data.original_price,
      image_url: data.image_url,
      images: data.images,
      amazon_url: data.amazon_url,
      affiliate_url: data.affiliate_url,
      category_id: data.category_id,
      // Only include these if the schema supports them
      // rating: data.rating,
      // review_count: data.review_count,
      is_published: data.is_published,
      is_featured: data.is_featured,
    };

    console.log('[createProduct] Attempting to create document with data:', productData);

    const product = await databases.createDocument(DATABASE_ID, COLLECTION_ID, 'unique()', productData);

    console.log('[createProduct] Successfully created:', { id: product.$id, title: product.title });

    // Update category product count
    if (data.category_id) {
      try {
        const category = await databases.getDocument(
          DATABASE_ID,
          process.env.APPWRITE_CATEGORIES_COLLECTION_ID || 'categories',
          data.category_id
        );
        const currentCount = (category as unknown as CategoryCountDocument).product_count || 0;
        await databases.updateDocument(
          DATABASE_ID,
          process.env.APPWRITE_CATEGORIES_COLLECTION_ID || 'categories',
          data.category_id,
          { product_count: currentCount + 1 }
        );
        console.log('[createProduct] Updated category product count');
      } catch (err) {
        console.error('[createProduct] Failed to update category count:', err);
      }
    }

    // Serialize to plain object to avoid Client Component serialization errors
    const serialized = JSON.parse(JSON.stringify(product)) as unknown as Product;

    return {
      success: true,
      data: serialized,
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to create product';
    console.error('[createProduct] ERROR:', errorMsg);
    console.error('[createProduct] Full error:', error);
    return {
      success: false,
      error: errorMsg,
    }
  }
}

/**
 * Update product (admin only)
 */
export async function updateProduct(
  id: string,
  data: Partial<ProductFormData>
): Promise<ApiResponse<Product>> {
  try {
    // Get the original product to check for category changes
    const originalProduct = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
    const originalCategoryId = (originalProduct as unknown as ProductCategoryDocument).category_id;
    const newCategoryId = data.category_id;

    // Filter out fields that don't exist in the schema
    const updateData: Record<string, unknown> = {};
    
    const validFields = [
      'title',
      'slug',
      'description',
      'short_desc',
      'price',
      'original_price',
      'image_url',
      'images',
      'amazon_url',
      'affiliate_url',
      'category_id',
      'is_published',
      'is_featured',
    ];

    for (const field of validFields) {
      if (field in data) {
        updateData[field] = data[field as keyof ProductFormData];
      }
    }

    console.log('[updateProduct] Updating document with:', updateData);

    const product = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, updateData);

    console.log('[updateProduct] Successfully updated:', { id: product.$id });

    // Handle category count updates if category changed
    if (newCategoryId && newCategoryId !== originalCategoryId) {
      try {
        // Decrement old category count
        if (originalCategoryId) {
          const oldCategory = await databases.getDocument(
            DATABASE_ID,
            process.env.APPWRITE_CATEGORIES_COLLECTION_ID || 'categories',
            originalCategoryId
          );
          const oldCount = (oldCategory as unknown as CategoryCountDocument).product_count || 0;
          await databases.updateDocument(
            DATABASE_ID,
            process.env.APPWRITE_CATEGORIES_COLLECTION_ID || 'categories',
            originalCategoryId,
            { product_count: Math.max(0, oldCount - 1) }
          );
        }

        // Increment new category count
        const newCategory = await databases.getDocument(
          DATABASE_ID,
          process.env.APPWRITE_CATEGORIES_COLLECTION_ID || 'categories',
          newCategoryId
        );
        const newCount = (newCategory as unknown as CategoryCountDocument).product_count || 0;
        await databases.updateDocument(
          DATABASE_ID,
          process.env.APPWRITE_CATEGORIES_COLLECTION_ID || 'categories',
          newCategoryId,
          { product_count: newCount + 1 }
        );
        console.log('[updateProduct] Updated category counts for category change');
      } catch (err) {
        console.error('[updateProduct] Failed to update category counts:', err);
      }
    }

    // Serialize to plain object to avoid Client Component serialization errors
    const serialized = JSON.parse(JSON.stringify(product)) as unknown as Product;

    return {
      success: true,
      data: serialized,
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to update product';
    console.error('[updateProduct] ERROR:', errorMsg);
    return {
      success: false,
      error: errorMsg,
    }
  }
}

/**
 * Delete product (admin only)
 */
export async function deleteProduct(id: string): Promise<ApiResponse<null>> {
  try {
    // Get the product to find its category
    const product = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
    const categoryId = (product as unknown as ProductCategoryDocument).category_id;

    // Delete the product
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);

    // Update category product count
    if (categoryId) {
      try {
        const category = await databases.getDocument(
          DATABASE_ID,
          process.env.APPWRITE_CATEGORIES_COLLECTION_ID || 'categories',
          categoryId
        );
        const currentCount = (category as unknown as CategoryCountDocument).product_count || 0;
        await databases.updateDocument(
          DATABASE_ID,
          process.env.APPWRITE_CATEGORIES_COLLECTION_ID || 'categories',
          categoryId,
          { product_count: Math.max(0, currentCount - 1) }
        );
        console.log('[deleteProduct] Updated category product count');
      } catch (err) {
        console.error('[deleteProduct] Failed to update category count:', err);
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete product',
    }
  }
}
