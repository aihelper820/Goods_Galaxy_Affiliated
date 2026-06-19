import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui';
import { getFeaturedProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { getAllSettings } from '@/lib/settings';
import Link from 'next/link';
import {
  Monitor,
  BookOpen,
  Dumbbell,
  Home,
  Shirt,
  Package,
  ArrowRight,
} from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

/** Map category names to pastel accent colors and icons */
function getCategoryStyle(
  name: string
): { icon: LucideIcon; bg: string; ring: string } {
  const lower = name.toLowerCase();

  if (lower.includes('electron') || lower.includes('tech') || lower.includes('gadget')) {
    return {
      icon: Monitor,
      bg: 'bg-red-50',
      ring: 'text-red-500',
    };
  }
  if (lower.includes('book') || lower.includes('read') || lower.includes('literature')) {
    return {
      icon: BookOpen,
      bg: 'bg-purple-50',
      ring: 'text-purple-500',
    };
  }
  if (lower.includes('fit') || lower.includes('sport') || lower.includes('gym') || lower.includes('health') || lower.includes('wellness')) {
    return {
      icon: Dumbbell,
      bg: 'bg-orange-50',
      ring: 'text-orange-500',
    };
  }
  if (lower.includes('home') || lower.includes('kitchen') || lower.includes('house') || lower.includes('garden') || lower.includes('living')) {
    return {
      icon: Home,
      bg: 'bg-emerald-50',
      ring: 'text-emerald-500',
    };
  }
  if (lower.includes('fashion') || lower.includes('cloth') || lower.includes('wear') || lower.includes('shoe') || lower.includes('apparel')) {
    return {
      icon: Shirt,
      bg: 'bg-pink-50',
      ring: 'text-pink-500',
    };
  }

  // Default
  return {
    icon: Package,
    bg: 'bg-indigo-50',
    ring: 'text-indigo-500',
  };
}

export const revalidate = 60;

export const metadata = {
  title: 'Goods Galaxy Affiliated - Curated Amazon Affiliate Products',
  description: 'Discover handpicked Amazon products curated with care for discerning readers.',
};

export default async function HomePage() {
  const [featuredProducts, categories, settings] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
    getAllSettings(),
  ]);
  const heroImages = [
    settings.hero_image_1,
    settings.hero_image_2,
    settings.hero_image_3,
  ]
    .map((image) => image?.trim())
    .filter((image): image is string => Boolean(image));

  const fallbackHeroImages = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop',
  ];

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Navbar categories={categories} />

      <main className="flex-1">
        <HeroSection
          tagline="Curated Discovery"
          headline="Find products worth keeping in your orbit"
          subheadline="A warm, image-first storefront for Amazon affiliate picks. Browse products, compare categories, and discover the pieces that fit your day-to-day life."
          images={heroImages.length > 0 ? heroImages : fallbackHeroImages}
          ctaLabels={{ primary: 'Explore Products', secondary: 'Browse Categories' }}
          ctaLinks={{ primary: '/products', secondary: '/categories' }}
        />

        <section className="section-shell">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">              <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
              <div>
                <div className="section-kicker mb-3">Featured</div>
                <h2 className="section-heading">Featured products</h2>
              </div>
              <p className="hidden max-w-md text-sm leading-6 text-on-surface-muted md:block">
                A compact, masonry-style preview of the latest curated picks.
              </p>
            </div>

            {featuredProducts && featuredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.$id} product={product} />
                ))}
              </div>
            ) : (
              <div className="panel px-6 py-12 text-center text-on-surface-muted">
                No featured products available yet.
              </div>
            )}
          </div>
        </section>

        <section className="section-shell">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-10 sm:mb-12 text-center sm:text-left">
              <div className="mb-3 inline-flex rounded-full bg-red-50 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-red-500">
                Categories
              </div>
              <h2 className="section-heading">Browse by category</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-muted sm:text-base sm:leading-7">
                Explore top categories and find the perfect products for your lifestyle.
              </p>
            </div>

            {categories && categories.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {categories.map((category) => {
                  const { icon: Icon, bg, ring } = getCategoryStyle(category.name);
                  return (
                    <Link
                      key={category.$id}
                      href={`/categories/${category.slug}`}
                      className="group flex w-full flex-col items-center rounded-[28px] border border-[#ECECEC] bg-white p-5 sm:p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      {/* Circular pastel icon area */}
                      <div
                        className={`mb-5 flex h-20 w-20 items-center justify-center rounded-full ${bg} transition-transform duration-300 group-hover:scale-105`}
                      >
                        <Icon size={32} className={ring} />
                      </div>

                      {/* Category label */}
                      <div className="mb-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-on-surface-muted">
                        Category
                      </div>

                      {/* Category name */}
                      <h3 className="text-lg font-bold text-on-surface transition-colors group-hover:text-primary">
                        {category.name}
                      </h3>

                      {/* Description */}
                      {category.description && (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-on-surface-muted">
                          {category.description}
                        </p>
                      )}

                      {/* Spacer */}
                      <div className="mt-auto" />

                      {/* Bottom row: product count + arrow */}
                      <div className="mt-5 flex w-full items-center justify-between border-t border-[#ECECEC] pt-4">
                        <span className="rounded-full bg-surface-container-low px-3 py-1 text-[0.65rem] font-semibold text-on-surface-muted">
                          {category.product_count || 0} products
                        </span>
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-on-surface text-white transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                          <ArrowRight size={15} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="panel-quiet px-6 py-12 text-center text-on-surface-muted">
                No categories available yet.
              </div>
            )}
          </div>
        </section>

        <section className="section-shell">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="panel overflow-hidden px-6 py-10 sm:px-10 sm:py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="section-kicker mb-3">Keep exploring</div>
                <h2 className="section-heading max-w-2xl text-center">
                  More to explore across the full catalog
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-on-surface-muted text-center">
                  Browse every curated product, compare picks across categories, and move from discovery to purchase without losing the thread.
                </p>
                <div className="mt-8">
                  <Link href="/products">
                    <Button variant="primary" size="lg">
                      View All Products
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
