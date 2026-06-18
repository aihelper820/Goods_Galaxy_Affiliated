'use client';

import { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, LayoutGrid, Package, Shapes, Settings } from 'lucide-react';

/**
 * Admin Layout Client Component
 * Separated from server component to handle client-side UI logic
 * Authentication is checked in the parent server component (/app/admin/layout.tsx)
 */
export default function AdminLayoutClient({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      console.log('[LOGOUT] Starting logout...');

      // Clear the server-side cookie via API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to clear session');
      }

      console.log('[LOGOUT] Server session cleared');

      // Redirect to login
      router.push('/admin/login');
    } catch (error) {
      console.error('[LOGOUT] Error:', error);
      alert('Logout failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/categories', label: 'Categories', icon: Shapes },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(230,0,35,0.08),_transparent_30%),linear-gradient(180deg,_#fffdf9_0%,_#f8f7f2_100%)] text-on-surface">
      <aside className="hidden w-72 flex-col border-r border-outline/15 bg-[rgba(255,255,255,0.84)] backdrop-blur-xl lg:flex">
        <div className="p-6">
          <div className="mb-5 inline-flex rounded-full bg-primary px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-on-primary">
            Admin Panel
          </div>
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-on-surface">Goods Galaxy Affiliated</h1>
          <p className="mt-2 text-sm leading-6 text-on-surface-muted">
            Warm, editorial controls for your curated storefront.
          </p>
        </div>

        <nav className="flex-1 px-4 pb-4">
          <div className="rounded-3xl border border-outline/10 bg-surface-elevated p-2 shadow-sm">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mb-1 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors last:mb-0 ${
                    isActive(item.href)
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-muted hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary px-4 py-3 text-sm font-semibold text-on-secondary transition-colors hover:bg-secondary/80"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="border-b border-outline/15 bg-[rgba(255,255,255,0.84)] px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-muted">Goods Galaxy</p>
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-on-surface">Admin workspace</h2>
            </div>
            <div className="rounded-full border border-outline/15 bg-surface-elevated px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-muted">
              Curated control center
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
