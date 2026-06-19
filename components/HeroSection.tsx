'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  tagline?: string;
  headline: string;
  subheadline: string;
  imageUrl?: string;
  imageAlt?: string;
  images?: string[];
  ctaLabels?: {
    primary: string;
    secondary: string;
  };
  ctaLinks?: {
    primary: string;
    secondary: string;
  };
}

export function HeroSection({
  tagline,
  headline,
  subheadline,
  imageUrl,
  imageAlt = 'Hero image',
  images = [],
  ctaLabels = { primary: 'Explore', secondary: 'Learn More' },
  ctaLinks = { primary: '/', secondary: '/' },
}: HeroSectionProps) {
  const normalizedImages = images
    .map((image) => image.trim())
    .filter((image) => image.length > 0);
  const normalizedImageUrl = imageUrl?.trim();
  const imageList = normalizedImages.length > 0 ? normalizedImages : (normalizedImageUrl ? [normalizedImageUrl] : []);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isAutoPlay || imageList.length === 0 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageList.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, imageList.length, isHovered]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
    setIsAutoPlay(false);
  }, [imageList.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
    setIsAutoPlay(false);
  }, [imageList.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    const carouselNode = carouselRef.current;

    if (carouselNode) {
      carouselNode.addEventListener('keydown', handleKeyDown);
      return () => carouselNode.removeEventListener('keydown', handleKeyDown);
    }
  }, [goToNext, goToPrevious]);

  return (
    <section className="section-shell overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-8 sm:gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:items-center">
        {/* Left content panel */}
        <div className="relative">
          <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" aria-hidden="true" />
          <div className="panel relative z-10 flex flex-col items-center p-6 text-center sm:p-8 lg:p-10">
            {tagline && <div className="section-kicker mb-4">{tagline}</div>}

            <h1 className="max-w-xl text-2xl font-bold leading-tight tracking-[-0.04em] text-on-surface sm:text-3xl md:text-4xl lg:text-5xl">
              {headline}
            </h1>

            <p className="mt-4 max-w-md text-sm leading-6 text-on-surface-muted sm:mt-5 sm:text-base sm:leading-7">
              {subheadline}
            </p>

            <div className="mt-6 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row sm:justify-center">
              <Link href={ctaLinks.primary}>
                <Button variant="primary" size="lg" className="w-full justify-center sm:w-auto">
                  {ctaLabels.primary}
                </Button>
              </Link>
              <Link href={ctaLinks.secondary}>
                <Button variant="ghost" size="lg" className="w-full justify-center sm:w-auto">
                  {ctaLabels.secondary}
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-muted sm:mt-8">
              <span className="warm-chip rounded-full px-3 py-2">Curated discovery</span>
              <span className="warm-chip rounded-full px-3 py-2">Warm editorial layout</span>
              <span className="warm-chip rounded-full px-3 py-2">Amazon affiliate picks</span>
            </div>
          </div>
        </div>

        {/* Right side — single large image carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {imageList.length > 0 ? (
            <div
              ref={carouselRef}
              tabIndex={0}
              role="region"
              aria-live="polite"
              aria-label="Featured product carousel"
              className="group pin-card relative h-full min-h-[280px] sm:min-h-[24rem] lg:min-h-[32rem] overflow-hidden rounded-2xl"
            >
              {/* Fade-transition images */}
              {imageList.map((image, index) => (
                <div
                  key={`slide-${index}`}
                  className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                  style={{ opacity: index === currentIndex ? 1 : 0 }}
                  aria-hidden={index !== currentIndex}
                >
                  <Image
                    src={image}
                    alt={`${imageAlt} ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 45vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" aria-hidden="true" />

              {/* Navigation arrows — visible on hover / always on touch devices */}
              {imageList.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-surface-elevated/90 text-on-surface shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:opacity-100 hover:bg-surface-elevated transition-all duration-300 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus min-h-[44px] min-w-[44px]"
                    aria-label={`Previous image, ${currentIndex} of ${imageList.length}`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-surface-elevated/90 text-on-surface shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:opacity-100 hover:bg-surface-elevated transition-all duration-300 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus min-h-[44px] min-w-[44px]"
                    aria-label={`Next image, ${currentIndex + 2} of ${imageList.length}`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Dots indicator */}
              {imageList.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {imageList.map((_, index) => (
                    <button
                      key={`dot-${index}`}
                      onClick={() => goToSlide(index)}
                      className={`rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                        index === currentIndex
                          ? 'w-6 h-2 bg-white'
                          : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="pin-card grid min-h-[24rem] place-items-center bg-surface-container-low text-on-surface-muted rounded-2xl">
              <span>No images available</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
