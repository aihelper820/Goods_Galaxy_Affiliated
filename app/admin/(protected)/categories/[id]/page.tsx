import { CategoryForm } from '@/components/CategoryForm';
import { fetchCategoryAction } from '../../admin-actions';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Edit Category | Admin',
};

interface EditCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const category = await fetchCategoryAction(id);

  if (!category) {
    notFound();
  }

  const serializedCategory = JSON.parse(JSON.stringify(category));

  return (
    <CategoryForm
      categoryId={id}
      initialData={{
        name: serializedCategory.name || '',
        slug: serializedCategory.slug || '',
        description: serializedCategory.description || '',
        display_order: String(serializedCategory.display_order ?? 0),
        is_active: Boolean(serializedCategory.is_active),
      }}
    />
  );
}