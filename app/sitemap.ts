import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ggacurator.com';

  // Static pages
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Product pages
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts({ page: 1, per_page: 1000 });
    if (products.data) {
      productRoutes = products.data.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Failed to generate product sitemap:', error);
  }

  // Category pages
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await getCategories();
    if (categories) {
      categoryRoutes = categories.map((category) => ({
        url: `${baseUrl}/categories/${category.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Failed to generate category sitemap:', error);
  }

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
