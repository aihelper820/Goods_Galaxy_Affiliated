'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Pagination, Input, EmptyState } from '@/components/ui';
import { Product, PaginatedResponse } from '@/lib/types';
import { Search } from 'lucide-react';
import Link from 'next/link';

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || null;
  const [products, setProducts] = useState<PaginatedResponse<Product> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const abortController = new AbortController();

    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const query = new URLSearchParams({
          category_slug: slug,
          page: String(currentPage),
          per_page: '12',
        });

        if (searchQuery.trim()) {
          query.set('search', searchQuery.trim());
        }

        const response = await fetch(`/api/products?${query.toString()}`, {
          signal: abortController.signal,
        });
        const result = (await response.json()) as PaginatedResponse<Product>;
        setProducts(result);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();

    return () => abortController.abort();
  }, [slug, currentPage, searchQuery]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  if (!slug) return null;

  const categoryName =
    slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || 'Category';

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-2 text-sm text-on-surface-muted">
            <Link href="/" className="transition-colors hover:text-on-surface">
              Home
            </Link>
            <span>/</span>
            <Link href="/categories" className="transition-colors hover:text-on-surface">
              Categories
            </Link>
            <span>/</span>
            <span className="font-medium text-on-surface">{categoryName}</span>
          </div>

          <div className="panel p-8 sm:p-10">
            <div className="section-kicker mb-3">Category</div>
            <h1 className="section-heading">{categoryName}</h1>
            <p className="mt-4 text-base leading-7 text-on-surface-muted">
              {products?.total ? `${products.total} products available` : 'Browse products in this category'}
            </p>
          </div>
        </div>

        <section className="section-shell-tight">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="panel p-4 sm:p-6">
            <Input
              icon={<Search size={18} />}
              placeholder="Search in this category..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={isLoading}
            />
            </div>
          </div>
        </section>

        <section className="section-shell-tight">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {products?.data && products.data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-10">
                  {products.data.map((product) => (
                    <ProductCard key={product.$id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {products.total_pages && products.total_pages > 1 && (
                  <div className="flex justify-center">
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
              <EmptyState
                title={searchQuery ? 'No products found' : 'No products in this category'}
                description={
                  searchQuery
                    ? `Try adjusting your search: "${searchQuery}"`
                    : 'Check back soon for new products'
                }
              />
            )}
          </div>
        </section>

        <section className="section-shell-tight">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <Link href="/categories">
              <button className="rounded-full border border-outline/20 bg-surface-elevated px-5 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low">
                Back to Categories
              </button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
