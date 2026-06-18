'use client';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="panel p-6 sm:p-8">
        <div className="section-kicker mb-3">Overview</div>
        <h1 className="text-2xl font-semibold tracking-[-0.04em] text-on-surface sm:text-3xl lg:text-4xl">Dashboard</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-on-surface-muted">
          Welcome to the Goods Galaxy Affiliated admin panel.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="pin-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-on-surface-muted">Total Products</p>
          <p className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-on-surface">0</p>
        </div>

        <div className="pin-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-on-surface-muted">Total Categories</p>
          <p className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-on-surface">0</p>
        </div>

        <div className="pin-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-on-surface-muted">Published Products</p>
          <p className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-on-surface">0</p>
        </div>

        <div className="pin-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-on-surface-muted">Featured Products</p>
          <p className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-on-surface">0</p>
        </div>
      </div>

      <div className="panel p-6 sm:p-8">
        <h2 className="mb-4 text-xl font-semibold text-on-surface">Recent Activity</h2>
        <div className="rounded-2xl border border-outline/15 bg-surface-container-low p-8 text-center text-on-surface-muted">
          No activities yet.
        </div>
      </div>
    </div>
  );
}
