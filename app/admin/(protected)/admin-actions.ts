'use server';

import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProducts,
  getRecentProducts,
} from '@/lib/products';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  getRecentCategories,
} from '@/lib/categories';
import { updateSetting, getAllSettings } from '@/lib/settings';
import {
  Product,
  ProductFormData,
  Category,
  CategoryFormData,
  ApiResponse,
  PaginatedResponse,
} from '@/lib/types';

// Products
export async function createProductAction(
  data: ProductFormData
): Promise<ApiResponse<Product>> {
  return createProduct(data);
}

export async function updateProductAction(
  id: string,
  data: ProductFormData
): Promise<ApiResponse<Product>> {
  return updateProduct(id, data);
}

export async function deleteProductAction(id: string): Promise<ApiResponse<null>> {
  return deleteProduct(id);
}

export async function fetchProductsAction(
  page: number,
  perPage: number
): Promise<PaginatedResponse<Product>> {
  return getAllProducts({ page, per_page: perPage });
}

export async function fetchProductAction(id: string): Promise<Product | null> {
  return getProductById(id);
}

// Categories
export async function createCategoryAction(
  data: CategoryFormData
): Promise<ApiResponse<Category>> {
  return createCategory(data);
}

export async function updateCategoryAction(
  id: string,
  data: CategoryFormData
): Promise<ApiResponse<Category>> {
  return updateCategory(id, data);
}

export async function deleteCategoryAction(id: string): Promise<ApiResponse<null>> {
  return deleteCategory(id);
}

export async function fetchCategoriesAction(): Promise<Category[]> {
  return getCategories();
}

export async function fetchCategoryAction(id: string): Promise<Category | null> {
  return getCategoryById(id);
}

// Dashboard Stats
export interface DashboardStats {
  totalProducts: number
  totalCategories: number
  publishedProducts: number
  featuredProducts: number
  recentProducts: Product[]
  recentCategories: Category[]
}

export async function fetchDashboardStatsAction(): Promise<DashboardStats> {
  const [
    allProductsResult,
    publishedResult,
    featuredResult,
    categories,
    recentProducts,
    recentCategories,
  ] = await Promise.all([
    getAllProducts({ page: 1, per_page: 1 }),
    getProducts({ page: 1, per_page: 1 }),
    getAllProducts({ page: 1, per_page: 1, is_featured: true }),
    getCategories(),
    getRecentProducts(5),
    getRecentCategories(5),
  ])

  return {
    totalProducts: allProductsResult.total,
    totalCategories: categories.length,
    publishedProducts: publishedResult.total,
    featuredProducts: featuredResult.total,
    recentProducts,
    recentCategories,
  }
}

// Settings
export async function updateSettingAction(
  key: string,
  value: string
): Promise<ApiResponse<Record<string, string>>> {
  const result = await updateSetting(key, value);
  return {
    success: result.success,
    error: result.error,
    data: result.success ? { [key]: value } : undefined,
    message: result.message,
  };
}

export async function fetchSettingsAction(): Promise<Record<string, string>> {
  return getAllSettings();
}
