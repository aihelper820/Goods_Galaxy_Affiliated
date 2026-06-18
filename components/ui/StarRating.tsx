'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  className = '',
}: StarRatingProps) {
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const iconSize = sizeMap[size];
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {stars.map((star) => (
        <Star
          key={star}
          size={iconSize}
          className={star <= Math.round(rating) ? 'fill-primary text-primary' : 'text-outline/35'}
        />
      ))}
      {rating > 0 && (
        <span className="ml-1 text-sm text-on-surface-muted">
          {rating.toFixed(1)} / {maxRating}
        </span>
      )}
    </div>
  );
}
