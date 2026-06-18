'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  className = '',
}: PaginationProps) {
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Generate page numbers to show (1-5 pages)
  const pageNumbers = [];
  let startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrev || isLoading}
        className="flex items-center gap-1 rounded-full"
      >
        <ChevronLeft size={16} />
        Previous
      </Button>

      <div className="flex gap-1 rounded-full bg-surface-container-low p-1">
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={isLoading}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              page === currentPage
                ? 'bg-primary text-on-primary shadow-sm'
                : 'border border-transparent text-on-surface hover:bg-surface-elevated'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {page}
          </button>
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext || isLoading}
        className="flex items-center gap-1 rounded-full"
      >
        Next
        <ChevronRight size={16} />
      </Button>

      <span className="ml-2 text-sm text-on-surface-muted">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}
