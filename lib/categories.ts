/**
 * Categories Module
 * CRUD operations for categories
 */

import 'server-only'
import { databases } from './appwrite-server'
import { Query } from 'node-appwrite'
import { serializeDocument } from './utils'
import { Category, CategoryFormData, ApiResponse } from './types'

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'affiliate_db'
const COLLECTION_ID = process.env.APPWRITE_CATEGORIES_COLLECTION_ID || 'categories'

interface CategoryDocument {
  $id: string
  name: string
  slug: string
  description?: string
  display_order: number
  is_active: boolean
  product_count?: number
}

/**
 * Get all active categories sorted by display order
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('is_active', true),
    ])

    return response.documents
      .map((doc) => serializeDocument(doc) as unknown as CategoryDocument)
      .sort((a, b) => a.display_order - b.display_order)
      .map((serialized) => {
        return {
          $id: serialized.$id,
          name: serialized.name,
          slug: serialized.slug,
          description: serialized.description,
          display_order: serialized.display_order,
          is_active: serialized.is_active,
          product_count: serialized.product_count,
        } as Category
      })
  } catch {
    return []
  }
}

/**
 * Get most recent categories (for dashboard activity)
 */
export async function getRecentCategories(limit: number = 5): Promise<Category[]> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc('$createdAt'),
      Query.limit(limit),
    ])

    return response.documents
      .map((doc) => serializeDocument(doc) as unknown as CategoryDocument)
      .map((serialized) => ({
        $id: serialized.$id,
        name: serialized.name,
        slug: serialized.slug,
        description: serialized.description,
        display_order: serialized.display_order,
        is_active: serialized.is_active,
        product_count: serialized.product_count,
      } as Category))
  } catch {
    return []
  }
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('slug', slug),
      Query.equal('is_active', true),
    ])

    if (response.documents.length === 0) return null

    const doc = serializeDocument(response.documents[0])
    return {
      $id: doc.$id,
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      display_order: doc.display_order,
      is_active: doc.is_active,
      product_count: doc.product_count,
    } as Category
  } catch {
    return null
  }
}

/**
 * Get category by ID
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const doc = serializeDocument(await databases.getDocument(DATABASE_ID, COLLECTION_ID, id))
    return {
      $id: doc.$id,
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      display_order: doc.display_order,
      is_active: doc.is_active,
      product_count: doc.product_count,
    } as Category
  } catch {
    return null
  }
}

/**
 * Create category (admin only)
 */
export async function createCategory(data: CategoryFormData): Promise<ApiResponse<Category>> {
  try {
    const category = await databases.createDocument(DATABASE_ID, COLLECTION_ID, 'unique()', {
      name: data.name,
      slug: data.slug,
      description: data.description,
      display_order: data.display_order,
      is_active: data.is_active,
      product_count: 0,
    })

    // Serialize to plain object to avoid Client Component serialization errors
    const serialized = JSON.parse(JSON.stringify(category)) as unknown as Category;

    return {
      success: true,
      data: serialized,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create category',
    }
  }
}

/**
 * Update category (admin only)
 */
export async function updateCategory(
  id: string,
  data: Partial<CategoryFormData>
): Promise<ApiResponse<Category>> {
  try {
    const category = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, {
      ...data,
    })

    // Serialize to plain object to avoid Client Component serialization errors
    const serialized = JSON.parse(JSON.stringify(category)) as unknown as Category;

    return {
      success: true,
      data: serialized,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update category',
    }
  }
}

/**
 * Delete category (admin only)
 * Returns error if category has products
 */
export async function deleteCategory(id: string): Promise<ApiResponse<null>> {
  try {
    // Check if category has products
    const category = (await databases.getDocument(DATABASE_ID, COLLECTION_ID, id)) as unknown as CategoryDocument
    if ((category.product_count || 0) > 0) {
      return {
        success: false,
        error: 'Cannot delete category with products',
      }
    }

    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete category',
    }
  }
}
