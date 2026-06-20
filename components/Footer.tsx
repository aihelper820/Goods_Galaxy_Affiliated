import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t border-[#3c382f] bg-[#33332e] text-[#f5f2ea]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="mb-4 inline-flex rounded-full bg-primary px-3 py-1 text-[0.75rem] font-semibold text-on-primary">
              Goods Galaxy Affiliated
            </div>
            <p className="max-w-xs text-sm leading-6 text-[#c7c3b8]">
              Curated Amazon finds presented in a warm, inspiration-first storefront.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#f5f2ea]">Explore</h4>
            <ul className="space-y-2 text-sm text-[#c7c3b8]">
              <li><Link href="/" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary rounded px-1 py-0.5 inline-block">Home</Link></li>
              <li><Link href="/categories" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary rounded px-1 py-0.5 inline-block">Categories</Link></li>
              <li><Link href="/products" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary rounded px-1 py-0.5 inline-block">All Products</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#f5f2ea]">Information</h4>
            <ul className="space-y-2 text-sm text-[#c7c3b8]">
              <li><Link href="/about" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary rounded px-1 py-0.5 inline-block">About Us</Link></li>
              <li><Link href="/disclaimer" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary rounded px-1 py-0.5 inline-block">Disclaimer</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary rounded px-1 py-0.5 inline-block">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#f5f2ea]">Contact</h4>
            <ul className="space-y-2 text-sm text-[#c7c3b8]">
              <li>
                <a href="mailto:info@gga.com" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary rounded px-1 py-0.5 inline-block">
              thegoodsgalaxyaffiliated@gmail.com
                </a>
              </li>
              <li>© {currentYear} GGA Curator</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 sm:pt-8 text-xs sm:text-sm text-[#c7c3b8] md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} Goods Galaxy Affiliated. All rights reserved.</p>
          <p>As an Amazon Associate, we earn from qualifying purchases.</p>
        </div>
      </div>
    </footer>
  );
}
