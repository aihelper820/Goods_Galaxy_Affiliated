/**
 * Type definitions for the Amazon Affiliate Marketing platform
 */

// Review-related types
export interface Review {
  author: string
  rating: number
  title: string
  body: string
  date: string
}

// Product-related types
export interface Product {
  $id: string
  title: string
  slug: string
  description?: string
  short_desc?: string
  price?: string
  original_price?: string
  image_url?: string
  images?: string[] // JSON array stored as string
  amazon_url: string
  affiliate_url?: string
  category_id?: string
  rating?: number
  review_count?: number
  reviews?: Review[] // JSON array stored as string or parsed array
  is_published: boolean
  is_featured: boolean
  created_at?: string
  $createdAt?: string
  $updatedAt?: string
}

export interface ProductFormData {
  title: string
  slug: string
  category_id: string
  short_desc?: string
  description?: string
  price?: string
  original_price?: string
  image_url?: string
  images?: string
  amazon_url: string
  affiliate_url?: string
  rating?: number
  review_count?: number
  is_published: boolean
  is_featured: boolean
}

// Category-related types
export interface Category {
  $id: string
  name: string
  slug: string
  description?: string
  display_order: number
  is_active: boolean
  product_count?: number
  $createdAt?: string
  $updatedAt?: string
}

export interface CategoryFormData {
  name: string
  slug: string
  description?: string
  display_order: number
  is_active: boolean
}

// Settings-related types
export interface Setting {
  $id: string
  key: string
  value?: string
  description?: string
  $createdAt?: string
  $updatedAt?: string
}

// Admin/User-related types
export interface AdminUser {
  $id: string
  email: string
  name: string
  $createdAt: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
  error?: string
}

// Amazon product fetch response
export interface AmazonProductData {
  title: string
  price?: string
  original_price?: string
  description?: string
  short_description?: string
  image_url?: string
  images?: string[]
  rating?: number
  review_count?: number
  asin: string
}

// Form submission states
export interface FormState {
  loading: boolean
  error?: string
  success: boolean
}

// Pagination params
export interface PaginationParams {
  page: number
  per_page: number
}

// Filter params for products
export interface ProductFilters extends PaginationParams {
  category_id?: string
  is_published?: boolean
  search?: string
  is_featured?: boolean
}

// Filter params for categories
export interface CategoryFilters {
  is_active?: boolean
}
