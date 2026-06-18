import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getCategories } from '@/lib/categories';

export const metadata = {
  title: 'About Us | Goods Galaxy Affiliated',
  description: 'Learn about Goods Galaxy Affiliated and our mission to curate the best Amazon products.',
};

export default async function AboutPage() {
  const categories = await getCategories();

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Navbar categories={categories} />

      <main className="flex-1">
        <section className="section-shell-tight">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="panel p-8 sm:p-10">
              <div className="section-kicker mb-3">About</div>
              <h1 className="section-heading">About Goods Galaxy Affiliated</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-on-surface-muted">
                Learn more about our mission and how we curate products for you.
              </p>
            </div>
          </div>
        </section>

        <section className="section-shell-tight">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="panel space-y-6 p-5 sm:p-8 lg:p-10">
              <div>
                <h2 className="mb-3 text-xl sm:text-2xl font-semibold text-on-surface">Our Mission</h2>
                <p className="leading-7 text-on-surface-muted">
                Goods Galaxy Affiliated is dedicated to curating the finest selection of Amazon products 
                handpicked with care for discerning readers and consumers. We believe in quality over quantity, 
                providing thoughtful recommendations across diverse categories.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl sm:text-2xl font-semibold text-on-surface">What We Do</h2>
                <p className="mb-4 leading-7 text-on-surface-muted">
                  We carefully research and select products from Amazon&apos;s vast catalog, focusing on:
                </p>
                <ul className="space-y-3 text-on-surface-muted">
                  <li>Quality and durability of products</li>
                  <li>Customer reviews and ratings</li>
                  <li>Value for money</li>
                  <li>Relevance to our curated categories</li>
                  <li>Up-to-date product information</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-3 text-xl sm:text-2xl font-semibold text-on-surface">Our Categories</h2>
                <p className="leading-7 text-on-surface-muted">
                  We organize products into distinct categories to help you find exactly what you&apos;re looking for,
                  whether you&apos;re searching for bestselling books, cutting-edge electronics, quality home goods,
                  or premium fitness equipment.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl sm:text-2xl font-semibold text-on-surface">Connect With Us</h2>
                <p className="leading-7 text-on-surface-muted">
                  Have questions or suggestions? We&apos;d love to hear from you. Contact us at{' '}
                  <a href="mailto:info@gga.com" className="font-semibold text-primary hover:underline">
                    info@gga.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
