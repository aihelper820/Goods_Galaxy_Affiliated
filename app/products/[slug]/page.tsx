import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductGallery } from '@/components/ProductGallery';
import { Button, StarRating } from '@/components/ui';
import { getProductBySlug, getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Review } from '@/lib/types';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ggacurator.com';
  const productUrl = `${baseUrl}/products/${product.slug}`;

  const allImages = getProductAllImages(product);
  const ogImages = allImages.length > 0
    ? allImages.map((url) => ({
        url,
        width: 800,
        height: 600,
        alt: product.title,
      }))
    : [];

  return {
    title: `${product.title} | GGA Curator`,
    description: product.short_desc || product.description,
    keywords: [product.title, 'amazon', 'product', 'review', 'affiliate'],
    openGraph: {
      title: product.title,
      description: product.short_desc || product.description,
      url: productUrl,
      type: 'article',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.short_desc || product.description,
      images: allImages.length > 0 ? [allImages[0]] : [],
    },
  };
}

/** Parse the stored images JSON string into an array of URLs */
function getProductAllImages(product: { image_url?: string | null; images?: string | string[] | null }): string[] {
  const imageSet = new Set<string>();

  // Primary image
  if (product.image_url?.trim()) {
    imageSet.add(product.image_url.trim());
  }

  // Additional images from the stored JSON string
  if (product.images) {
    if (typeof product.images === 'string') {
      try {
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed)) {
          parsed.forEach((url: string) => {
            const t = typeof url === 'string' ? url.trim() : '';
            if (t) imageSet.add(t);
          });
        }
      } catch {
        // not JSON, ignore
      }
    } else if (Array.isArray(product.images)) {
      product.images.forEach((url) => {
        const t = url?.trim?.() || '';
        if (t) imageSet.add(t);
      });
    }
  }

  return Array.from(imageSet);
}

export async function generateStaticParams() {
  const products = await getProducts({ page: 1, per_page: 100 });

  return (
    products.data?.map((product) => ({
      slug: product.slug,
    })) || []
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const categories = await getCategories();

  if (!product) {
    notFound();
  }

  // Parse all product images
  const allImages = getProductAllImages(product);

  let reviews: Review[] = [];
  if (product.reviews) {
    if (typeof product.reviews === 'string') {
      try {
        reviews = JSON.parse(product.reviews);
      } catch {
        reviews = [];
      }
    } else if (Array.isArray(product.reviews)) {
      reviews = product.reviews;
    }
  }

  // Limit to 5 reviews
  reviews = reviews.slice(0, 5);

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Navbar categories={categories} />

      <main className="flex-1">
        <section className="section-shell-tight">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-on-surface-muted mb-4 sm:mb-5">
              <Link href="/" className="transition-colors hover:text-on-surface">Home</Link>
              <span>/</span>
              <Link href="/products" className="transition-colors hover:text-on-surface">Products</Link>
              <span>/</span>
              <span className="font-medium text-on-surface">{product.title}</span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-10 lg:items-start">
              <div className="order-2 lg:order-1">
                <ProductGallery
                  images={allImages}
                  productTitle={product.title}
                />
              </div>

              <div className="order-1 lg:order-2">
                <div className="panel p-5 sm:p-6 lg:p-8">
                  <div className="section-kicker mb-2.5">Product</div>
                  <h1 className="text-2xl font-semibold tracking-[-0.03em] text-on-surface sm:text-[1.75rem] lg:text-4xl line-clamp-3">
                    {product.title}
                  </h1>

                  <div className="mt-4 flex items-end gap-3">
                    <span className="text-2xl sm:text-3xl font-semibold text-on-surface">${product.price}</span>
                    {product.original_price && (
                      <span className="pb-0.5 text-base sm:text-lg text-on-surface-muted line-through">${product.original_price}</span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-on-surface-muted">Sold by Amazon</p>

                  {product.short_desc && (
                    <p className="mt-4 text-sm leading-6 text-on-surface-muted border-t border-outline/10 pt-4">
                      {product.short_desc}
                    </p>
                  )}

                  {product.affiliate_url || product.amazon_url ? (
                    <a
                      href={product.affiliate_url || product.amazon_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex w-full sm:w-auto"
                    >
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full sm:w-auto bg-[#e60023] text-white hover:bg-[#c4001d] justify-center"
                      >
                        Check on Amazon
                      </Button>
                    </a>
                  ) : null}

                  <div className="mt-5 rounded-xl border border-outline/10 bg-surface-container-low px-4 py-3 text-xs leading-5 text-on-surface-muted">
                    <strong className="text-on-surface">Disclosure:</strong> As an Amazon Associate, we earn from qualifying purchases. This helps support our content creation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {product.description && (
          <section className="section-shell-tight">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="panel p-5 sm:p-7">
                <h2 className="mb-3 text-xl font-semibold text-on-surface sm:text-2xl">Product Description</h2>
                <div className="max-w-none">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-on-surface-muted sm:text-base">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="section-shell-tight">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="panel p-5 sm:p-7">
              <h2 className="mb-6 text-xl font-semibold text-on-surface sm:text-2xl">Reviews</h2>

              {reviews && reviews.length > 0 ? (
                <div className="space-y-5">
                  {reviews.map((review, index) => (
                    <div key={index} className="pb-5 border-b border-outline/10 last:border-b-0">
                      <div className="mb-2.5">
                        <StarRating rating={review.rating} />
                      </div>

                      <h3 className="mb-1.5 text-base font-semibold text-on-surface sm:text-lg">{review.title}</h3>

                      <p className="mb-2.5 text-sm leading-6 text-on-surface-muted sm:text-base sm:leading-7">{review.body}</p>

                      <p className="text-xs sm:text-sm text-on-surface-muted">
                        {review.author} • {review.date}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-outline/10 bg-surface-container-low py-8 text-center text-on-surface-muted">
                  No reviews available yet
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="section-shell-tight">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <Link href="/products">
              <Button variant="ghost">Back to Products</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
