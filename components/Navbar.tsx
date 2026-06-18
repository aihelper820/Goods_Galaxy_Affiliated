'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Category } from '@/lib/types';

interface NavbarProps {
  categories?: Category[];
}

export function Navbar({ categories = [] }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-outline/20 bg-[rgba(255,253,249,0.88)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8 min-h-[60px]">
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="Goods Galaxy Affiliated home">
          <Image
            src="/images/logo.png"
            alt="Goods Galaxy Affiliated"
            width={40}
            height={40}
            className="h-auto w-auto"
            priority
          />
          <span className="text-sm font-semibold tracking-tight text-on-surface md:text-base hidden sm:inline">
            Goods Galaxy Affiliated
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2 ml-auto" aria-label="Main navigation">
          <Link href="/" className="rounded-full px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            Home
          </Link>
          <Link href="/products" className="rounded-full px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            Products
          </Link>

          {categories && categories.length > 0 && (
            <div className="relative group">
              <button 
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Categories
                <ChevronDown size={16} className="text-on-surface-muted" aria-hidden="true" />
              </button>
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-outline/20 bg-surface-elevated shadow-[0_24px_60px_rgba(33,25,34,0.12)] opacity-0 invisible transition-all duration-200 group-hover:visible group-hover:opacity-100">
                {categories.map((category) => (
                  <Link
                    key={category.$id}
                    href={`/categories/${category.slug}`}
                    className="block px-4 py-3 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        <button
          className="ml-auto inline-flex h-10 w-10 min-w-[44px] min-h-[44px] items-center justify-center rounded-full border border-outline/20 bg-surface-elevated text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus md:hidden touch-target"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden border-t border-outline/15 bg-surface-elevated"
          ref={menuRef}
        >
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="grid gap-2">
              <Link 
                href="/" 
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-on-surface hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus block transition-colors" 
                onClick={handleLinkClick}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-on-surface hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus block transition-colors" 
                onClick={handleLinkClick}
              >
                Products
              </Link>

              {categories && categories.length > 0 && (
                <>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-on-surface hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus transition-colors"
                    aria-expanded={isDropdownOpen}
                    aria-controls="mobile-categories"
                  >
                    <span>Categories</span>
                    <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>

                  {isDropdownOpen && (
                    <div id="mobile-categories" className="grid gap-1 rounded-2xl border border-outline/15 bg-surface-container-low p-2">
                      {categories.map((category) => (
                        <Link
                          key={category.$id}
                          href={`/categories/${category.slug}`}
                          className="rounded-xl px-4 py-3 text-sm font-medium text-on-surface-muted hover:bg-surface-elevated hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus transition-colors block"
                          onClick={handleLinkClick}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
