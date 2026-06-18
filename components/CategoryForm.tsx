'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, Button, Input } from '@/components/ui';
import { createCategoryAction, updateCategoryAction } from '@/app/admin/(protected)/admin-actions';
import { CategoryFormData } from '@/lib/types';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface CategoryFormProps {
  categoryId?: string;
  initialData?: {
    name: string;
    slug: string;
    description: string;
    display_order: string;
    is_active: boolean;
  };
}

export function CategoryForm({ categoryId, initialData }: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>(
    initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          description: initialData.description,
          display_order: parseInt(initialData.display_order, 10),
          is_active: initialData.is_active,
        }
      : {
          name: '',
          slug: '',
          description: '',
          display_order: 0,
          is_active: true,
        }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : name === 'display_order'
            ? parseInt(value, 10) || 0
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = categoryId
        ? await updateCategoryAction(categoryId, formData)
        : await createCategoryAction(formData);

      if (result.success) {
        toast.success(
          categoryId ? 'Category updated successfully' : 'Category created successfully'
        );
        router.push('/admin/categories');
      } else {
        toast.error(result.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save category');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="panel flex items-center gap-4 p-6">
        <Link href="/admin/categories">
          <Button variant="ghost" size="sm">
            <ChevronLeft size={18} />
          </Button>
        </Link>
        <div>
          <div className="section-kicker mb-3">Category editor</div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-on-surface">
            {categoryId ? 'Edit Category' : 'New Category'}
          </h1>
          <p className="mt-2 text-sm leading-6 text-on-surface-muted">
            {categoryId ? 'Update category details' : 'Create a new product category'}
          </p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Input
              label="Category Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Electronics"
              required
            />
            <Input
              label="URL Slug *"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="e.g., electronics"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-on-surface">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief category description"
              rows={3}
              className="w-full rounded-2xl border border-outline/70 bg-surface-elevated px-3 py-2.5 text-on-surface placeholder:text-on-surface-muted focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus"
            />
          </div>

          {/* Display Order */}
          <Input
            label="Display Order"
            name="display_order"
            type="number"
            value={formData.display_order || ''}
            onChange={handleChange}
            placeholder="0"
            helperText="Lower numbers appear first"
          />

          {/* Active Status */}
          <div className="rounded-2xl border border-outline/15 bg-surface-container-low p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-on-surface">Active category</span>
            </label>
          </div>

          <div className="flex gap-3 border-t border-outline/15 pt-4">
            <Link href="/admin/categories">
              <Button variant="ghost">Cancel</Button>
            </Link>
            <Button
              variant="primary"
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {categoryId ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
