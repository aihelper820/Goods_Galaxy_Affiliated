'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.image_url?.trim();

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.affiliate_url || product.amazon_url) {
      window.open(product.affiliate_url || product.amazon_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full max-w-full">
      <Link href={`/products/${product.slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-2xl block">
        <div className="pin-card group flex h-full flex-col transition-transform duration-200 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-focus rounded-2xl">
          <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden bg-surface-container-low rounded-t-2xl">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                quality={75}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface-container-low">
                <span className="text-xs text-on-surface-muted">No image</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-outline/10 px-3 py-3 sm:px-4 sm:py-4">
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-xs font-semibold text-on-surface sm:truncate sm:text-sm">{product.title}</p>
              <p className="mt-0.5 hidden text-xs text-on-surface-muted sm:block">Shop the curated pick</p>
            </div>

            <button
              onClick={handleBuyClick}
              className="shrink-0 rounded-md bg-[#e60023] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#c4001d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:px-5 sm:text-sm min-w-[44px] min-h-[36px] sm:min-h-[44px] flex items-center justify-center"
              aria-label={`Buy ${product.title}`}
            >
              Buy
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
