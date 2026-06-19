'use client';

import { useState, useEffect } from 'react';
import { fetchDashboardStatsAction, DashboardStats } from '../admin-actions';
import { Spinner } from '@/components/ui';
import Link from 'next/link';
import { Package, FolderOpen, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async (silent: boolean = false) => {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    if (!silent) setError(null);
    try {
      const result = await fetchDashboardStatsAction();
      setStats(result);
      if (silent) setError(null);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      if (!silent) {
        setError('Failed to load dashboard statistics');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Combine recent products and categories into a single activity feed
  const recentActivity = stats
    ? [
        ...stats.recentProducts.map((p) => {
          const isUpdated = p.$createdAt && p.$updatedAt && p.$createdAt !== p.$updatedAt;
          return {
            id: p.$id,
            type: 'product' as const,
            title: p.title,
            slug: p.slug,
            createdAt: p.$updatedAt || p.$createdAt || '',
            label: isUpdated ? 'Product updated' : 'Product created',
            link: `/admin/products/${p.$id}`,
          };
        }),
        ...stats.recentCategories.map((c) => ({
          id: c.$id,
          type: 'category' as const,
          title: c.name,
          slug: c.slug,
          createdAt: c.$createdAt || '',
          label: 'Category created' as const,
          link: `/admin/categories/${c.$id}`,
        })),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
    : [];

  return (
    <div className="space-y-8">
      <div className="panel p-6 sm:p-8">
        <div className="section-kicker mb-3">Overview</div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.04em] text-on-surface sm:text-3xl lg:text-4xl">Dashboard</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-on-surface-muted">
              Welcome to the Goods Galaxy Affiliated admin panel.
            </p>
          </div>
          <button
            onClick={() => loadStats(true)}
            disabled={isRefreshing}
            className="flex shrink-0 items-center gap-2 rounded-full border border-outline/30 px-4 py-2 text-sm font-medium text-on-surface-muted transition-all duration-200 hover:bg-surface-container-low hover:text-on-surface active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh dashboard data"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="pin-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-on-surface-muted">Total Products</p>
          <p className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-on-surface">
            {isLoading ? <Spinner size="sm" /> : error ? <span className="text-on-surface-muted">—</span> : stats?.totalProducts ?? 0}
          </p>
        </div>

        <div className="pin-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-on-surface-muted">Total Categories</p>
          <p className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-on-surface">
            {isLoading ? <Spinner size="sm" /> : error ? <span className="text-on-surface-muted">—</span> : stats?.totalCategories ?? 0}
          </p>
        </div>

        <div className="pin-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-on-surface-muted">Published Products</p>
          <p className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-on-surface">
            {isLoading ? <Spinner size="sm" /> : error ? <span className="text-on-surface-muted">—</span> : stats?.publishedProducts ?? 0}
          </p>
        </div>

        <div className="pin-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-on-surface-muted">Featured Products</p>
          <p className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-on-surface">
            {isLoading ? <Spinner size="sm" /> : error ? <span className="text-on-surface-muted">—</span> : stats?.featuredProducts ?? 0}
          </p>
        </div>
      </div>

      <div className="panel p-6 sm:p-8">
        <h2 className="mb-4 text-xl font-semibold text-on-surface">Recent Activity</h2>
        {isLoading ? (
          <div className="flex items-center justify-center rounded-2xl border border-outline/15 bg-surface-container-low p-8">
            <Spinner size="md" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-outline/15 bg-surface-container-low p-8 text-center text-on-surface-muted">
            Failed to load recent activity.
          </div>
        ) : recentActivity.length > 0 ? (
          <div className="divide-y divide-outline/10 rounded-2xl border border-outline/15">
            {recentActivity.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                href={item.link}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface-container-low/70"
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs ${
                  item.type === 'product'
                    ? 'bg-[#e8f4ec] text-[#103c25]'
                    : 'bg-[#dbe3ff] text-[#435ee5]'
                }`}>
                  {item.type === 'product' ? <Package size={16} /> : <FolderOpen size={16} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-on-surface">{item.title}</p>
                <p className="text-xs text-on-surface-muted">
                  {item.label}
                </p>
                </div>
                <span className="shrink-0 text-xs text-on-surface-muted">
                  {formatRelativeTime(item.createdAt)}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-outline/15 bg-surface-container-low p-8 text-center text-on-surface-muted">
            No activities yet.
          </div>
        )}
      </div>
    </div>
  );
}

function formatRelativeTime(dateString: string): string {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
