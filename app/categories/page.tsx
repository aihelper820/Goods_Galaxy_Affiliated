import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getCategories } from '@/lib/categories';
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
    return { icon: Monitor, bg: 'bg-red-50', ring: 'text-red-500' };
  }
  if (lower.includes('book') || lower.includes('read') || lower.includes('literature')) {
    return { icon: BookOpen, bg: 'bg-purple-50', ring: 'text-purple-500' };
  }
  if (lower.includes('fit') || lower.includes('sport') || lower.includes('gym') || lower.includes('health') || lower.includes('wellness')) {
    return { icon: Dumbbell, bg: 'bg-orange-50', ring: 'text-orange-500' };
  }
  if (lower.includes('home') || lower.includes('kitchen') || lower.includes('house') || lower.includes('garden') || lower.includes('living')) {
    return { icon: Home, bg: 'bg-emerald-50', ring: 'text-emerald-500' };
  }
  if (lower.includes('fashion') || lower.includes('cloth') || lower.includes('wear') || lower.includes('shoe') || lower.includes('apparel')) {
    return { icon: Shirt, bg: 'bg-pink-50', ring: 'text-pink-500' };
  }
  return { icon: Package, bg: 'bg-indigo-50', ring: 'text-indigo-500' };
}

export const revalidate = 60;

export const metadata = {
  title: 'Categories | Goods Galaxy Affiliated',
  description: 'Browse products by category',
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Navbar categories={categories} />

      <main className="flex-1">
        <section className="section-shell-tight">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="panel p-6 sm:p-8 lg:p-10">
              <div className="mb-3 inline-flex rounded-full bg-red-50 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-red-500">
                Categories
              </div>
              <h1 className="section-heading">Browse by category</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-muted sm:text-base sm:leading-7">
                Find products that interest you across our curated categories.
              </p>
            </div>
          </div>
        </section>

        <section className="section-shell-tight">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {categories && categories.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                      <h2 className="text-lg font-bold text-on-surface transition-colors group-hover:text-primary">
                        {category.name}
                      </h2>

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
      </main>

      <Footer />
    </div>
  );
}
