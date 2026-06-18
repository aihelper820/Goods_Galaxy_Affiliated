import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getCategories } from '@/lib/categories';

export const metadata = {
  title: 'Disclaimer | Goods Galaxy Affiliated',
  description: 'Important disclaimer and affiliate disclosure information.',
};

export default async function DisclaimerPage() {
  const categories = await getCategories();

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Navbar categories={categories} />

      <main className="flex-1">
        <section className="section-shell-tight">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="panel p-8 sm:p-10">
              <div className="section-kicker mb-3">Disclaimer</div>
              <h1 className="section-heading">Disclaimer</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-on-surface-muted">
                Important information about our content and recommendations.
              </p>
            </div>
          </div>
        </section>

        <section className="section-shell-tight">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="panel space-y-6 p-5 sm:p-8 lg:p-10">
              <div>
                <h2 className="mb-3 text-xl sm:text-2xl font-semibold text-on-surface">Affiliate Disclosure</h2>
                <p className="leading-7 text-on-surface-muted">
                Goods Galaxy Affiliated is a participant in the Amazon Services LLC Associates Program, 
                an affiliate advertising program designed to provide a means for sites to earn advertising 
                fees by advertising and linking to Amazon.com and affiliated sites.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl sm:text-2xl font-semibold text-on-surface">What This Means</h2>
                <p className="leading-7 text-on-surface-muted">
                  When you click on links to products on this website and make a purchase on Amazon,
                  we may earn a commission. This does not incur any additional cost to you and does not
                  affect the price you pay.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl sm:text-2xl font-semibold text-on-surface">Our Recommendations</h2>
                <p className="leading-7 text-on-surface-muted">
                  All product recommendations are based on our honest evaluation of product quality,
                  value, and customer satisfaction. We do not let affiliate commissions influence our
                  product selections. We only recommend products we believe are genuinely worthwhile.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl sm:text-2xl font-semibold text-on-surface">Product Information</h2>
                <p className="leading-7 text-on-surface-muted">
                  The product information, prices, and availability displayed on this website are provided
                  for informational purposes only. Please verify all details on Amazon before making your
                  purchase, as prices and availability can change frequently.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl sm:text-2xl font-semibold text-on-surface">No Warranties</h2>
                <p className="leading-7 text-on-surface-muted">
                  We make no representations or warranties regarding the content or products listed on
                  this website. All content is provided &quot;as is&quot; without warranties of any kind, express
                  or implied. We shall not be liable for any damages arising from the use of this website
                  or the products discussed herein.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl sm:text-2xl font-semibold text-on-surface">External Links</h2>
                <p className="leading-7 text-on-surface-muted">
                  This website contains links to external websites. We are not responsible for the content,
                  accuracy, or practices of these external sites. Please review their terms and conditions
                  before use.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
