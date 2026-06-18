'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Input, Pagination, EmptyState } from '@/components/ui';
import { Product, PaginatedResponse } from '@/lib/types';
import { Search } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<PaginatedResponse<Product> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          per_page: '12',
        });

        if (searchQuery.trim()) {
          params.set('search', searchQuery.trim());
        }

        const response = await fetch(`/api/products?${params.toString()}`);
        const result = (await response.json()) as PaginatedResponse<Product>;
        setProducts(result);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, searchQuery]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="section-shell-tight">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="panel p-8 sm:p-10">
              <div className="section-kicker mb-3">Products</div>
              <h1 className="section-heading">All products</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-on-surface-muted">
                Browse our complete collection of handpicked products.
              </p>
            </div>
          </div>
        </section>

        <section className="section-shell-tight">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="panel p-4 sm:p-6">
            <Input
              icon={<Search size={18} />}
              placeholder="Search products..."
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
                title={searchQuery ? 'No products found' : 'No products available'}
                description={
                  searchQuery
                    ? `Try adjusting your search: "${searchQuery}"`
                    : 'Check back soon for new products'
                }
              />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
