import { ProductForm } from '@/components/ProductForm';
import { fetchProductAction } from '../../admin-actions';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Edit Product | Admin',
};

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await fetchProductAction(id);

  if (!product) {
    notFound();
  }

  // Serialize product data to plain object to avoid Client Component serialization errors
  const serializedProduct = JSON.parse(JSON.stringify(product));

  return (
    <ProductForm
      productId={id}
      initialData={{
        title: serializedProduct.title || '',
        slug: serializedProduct.slug || '',
        description: serializedProduct.description || '',
        short_desc: serializedProduct.short_desc || '',
        price: String(serializedProduct.price || ''),
        original_price: String(serializedProduct.original_price || ''),
        image_url: serializedProduct.image_url || '',
        images: serializedProduct.images || '',
        amazon_url: serializedProduct.amazon_url || '',
        category_id: serializedProduct.category_id || '',
        rating: '0',
        review_count: '0',
        is_published: Boolean(serializedProduct.is_published),
        is_featured: Boolean(serializedProduct.is_featured),
      }}
    />
  );
}
