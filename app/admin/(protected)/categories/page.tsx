'use client';

import { useState, useEffect } from 'react';
import { Card, Button, ConfirmDialog } from '@/components/ui';
import { fetchCategoriesAction, deleteCategoryAction } from '../admin-actions';
import { Category } from '@/lib/types';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const result = await fetchCategoriesAction();
      setCategories(result);
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const result = await deleteCategoryAction(deleteId);
      if (result.success) {
        toast.success('Category deleted successfully');
        setDeleteId(null);
        loadCategories();
      } else {
        toast.error(result.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="panel flex flex-col gap-4 p-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="section-kicker mb-3">Catalog</div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-on-surface">Categories</h1>
          <p className="mt-3 text-sm leading-6 text-on-surface-muted">Manage product categories.</p>
        </div>
        <Link href="/admin/categories/new">
          <Button variant="primary">
            <Plus size={18} />
            New Category
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <Card key={category.$id} className="overflow-hidden">
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-on-surface">{category.name}</h3>
                    {category.description && (
                      <p className="mt-1 text-sm text-on-surface-muted">{category.description}</p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      category.is_active
                        ? 'bg-[#e8f4ec] text-[#103c25]'
                        : 'bg-surface-container-low text-on-surface-muted'
                    }`}
                  >
                    {category.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="mb-4 text-sm text-on-surface-muted">
                  {category.product_count || 0} products
                </p>

                <div className="flex gap-2">
                  <Link href={`/admin/categories/${category.$id}`} className="flex-1">
                    <Button variant="ghost" size="sm" className="w-full justify-center">
                      <Edit2 size={16} className="mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteId(category.$id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-on-surface-muted">
            <p>No categories yet. Create your first category to get started.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? Products in this category will need to be reassigned."
        confirmText="Delete"
        isDangerous
        isLoading={isDeleting}
      />
    </div>
  );
}
