'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, Button, Pagination, ConfirmDialog } from '@/components/ui';
import { fetchProductsAction, deleteProductAction } from '../admin-actions';
import { Product, PaginatedResponse } from '@/lib/types';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState<PaginatedResponse<Product> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const result = await fetchProductsAction(currentPage, 10);
        setProducts(result);
      } catch (error) {
        console.error('Failed to load products:', error);
        toast.error('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [currentPage]);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const result = await deleteProductAction(deleteId);
      if (result.success) {
        toast.success('Product deleted successfully');
        setDeleteId(null);
        // Reload products
        const updated = await fetchProductsAction(currentPage, 10);
        setProducts(updated);
      } else {
        toast.error(result.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="panel flex flex-col gap-4 p-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="section-kicker mb-3">Catalog</div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-on-surface">Products</h1>
          <p className="mt-3 text-sm leading-6 text-on-surface-muted">Manage your product catalog.</p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="primary">
            <Plus size={18} />
            New Product
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>

        {products?.data && products.data.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-container-low/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-muted">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-muted">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-muted">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-muted">Featured</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline/10">
                  {products.data.map((product) => (
                    <tr key={product.$id} className="transition-colors hover:bg-surface-container-low/70">
                      <td className="px-6 py-4 font-medium text-on-surface">{product.title}</td>
                      <td className="px-6 py-4 text-on-surface-muted">${product.price}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            product.is_published
                              ? 'bg-[#e8f4ec] text-[#103c25]'
                              : 'bg-[#fff4df] text-[#7a4d00]'
                          }`}
                        >
                          {product.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {product.is_featured ? (
                          <span className="inline-flex items-center rounded-full bg-[#dbe3ff] px-3 py-1 text-xs font-semibold text-[#435ee5]">
                            Yes
                          </span>
                        ) : (
                          <span className="text-on-surface-muted">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                        <Link href={`/admin/products/${product.$id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit2 size={16} />
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeleteId(product.$id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {products.total_pages && products.total_pages > 1 && (
              <div className="border-t border-outline/10 px-6 py-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={products.total_pages}
                  onPageChange={setCurrentPage}
                  isLoading={isLoading}
                />
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center text-on-surface-muted">
            <p>No products yet. Create your first product to get started.</p>
          </div>
        )}
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        isDangerous
        isLoading={isDeleting}
      />
    </div>
  );
}
