'use server';

import { getProducts, getProductsByCategory } from '@/lib/products';
import { ProductFilters, PaginatedResponse, Product } from '@/lib/types';

export async function fetchProducts(
  filters: ProductFilters
): Promise<PaginatedResponse<Product>> {
  return getProducts(filters);
}

export async function fetchProductsByCategory(
  categorySlug: string,
  filters: ProductFilters
): Promise<PaginatedResponse<Product>> {
  return getProductsByCategory(categorySlug, filters);
}
