'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productTitle: string;
}

export function ProductGallery({ images, productTitle }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handleThumbnailClick = (index: number) => {
    if (index === selectedIndex) return;
    setSelectedIndex(index);
  };

  if (images.length === 0) {
    return (
      <div className="pin-card overflow-hidden">
        <div className="relative aspect-square bg-surface-container-low">
          <div className="flex h-full w-full items-center justify-center bg-surface-container-low">
            <span className="text-sm text-on-surface-muted">No image available</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pin-card overflow-hidden">
      {/* Main image with crossfade and navigation arrows */}
      <div
        className="group relative aspect-square bg-surface-container-low"
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') { e.preventDefault(); goToPrevious(); }
          if (e.key === 'ArrowRight') { e.preventDefault(); goToNext(); }
        }}
        tabIndex={0}
        role="region"
        aria-label={`Product image viewer, image ${selectedIndex + 1} of ${images.length}`}
        aria-roledescription="carousel"
      >
        {images.map((url, index) => (
          <div
            key={`main-${index}`}
            className="absolute inset-0 transition-opacity duration-500 ease-in-out"
            style={{ opacity: index === selectedIndex ? 1 : 0 }}
            aria-hidden={index !== selectedIndex}
          >
            <Image
              src={url}
              alt={`${productTitle}${index === 0 ? '' : ` - image ${index + 1}`}`}
              width={500}
              height={500}
              className="h-full w-full object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Arrow navigation — shown on hover / always on focus */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-surface-elevated/85 text-on-surface shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:!opacity-100 hover:bg-surface-elevated transition-all duration-300 focus-visible:!opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus min-h-[44px] min-w-[44px]"
              aria-label={`Previous image, ${selectedIndex} of ${images.length}`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-surface-elevated/85 text-on-surface shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:!opacity-100 hover:bg-surface-elevated transition-all duration-300 focus-visible:!opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus min-h-[44px] min-w-[44px]"
              aria-label={`Next image, ${selectedIndex + 2} of ${images.length}`}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Gallery thumbnails */}
      {images.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto px-4 pb-4 pt-3 scrollbar-hide"
          role="listbox"
          aria-label="Product image gallery"
        >
          {images.map((url, index) => (
            <button
              key={`thumb-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              aria-label={`${productTitle} ${index + 1}${index === 0 ? ' (primary)' : ''}`}
              onClick={() => handleThumbnailClick(index)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-surface-container-low transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                index === selectedIndex
                  ? 'border-primary ring-1 ring-primary'
                  : 'border-outline/15 hover:border-primary/50'
              }`}
            >
              <Image
                src={url}
                alt={`${productTitle} ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
