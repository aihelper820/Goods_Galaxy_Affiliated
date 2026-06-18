import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getCategories } from '@/lib/categories';

export const metadata = {
  title: 'Privacy Policy | Goods Galaxy Affiliated',
  description: 'Our privacy policy and how we handle your data.',
};

export default async function PrivacyPage() {
  const categories = await getCategories();

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Navbar categories={categories} />

      <main className="flex-1">
        <section className="section-shell-tight">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="panel p-8 sm:p-10">
              <div className="section-kicker mb-3">Privacy</div>
              <h1 className="section-heading">Privacy Policy</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-on-surface-muted">
                How we collect, use, and protect your personal information.
              </p>
            </div>
          </div>
        </section>

        <section className="section-shell-tight">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="panel space-y-6 p-5 sm:p-8 lg:p-10">
              <div>
                <h2 className="mb-3 text-xl sm:text-2xl font-semibold text-on-surface">Our Commitment</h2>
                <p className="leading-7 text-on-surface-muted">
                Goods Galaxy Affiliated is committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you visit 
                our website.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl sm:text-2xl font-semibold text-on-surface">Information We Collect</h2>
                <p className="mb-4 leading-7 text-on-surface-muted">We may collect information about you in a variety of ways:</p>
                <ul className="space-y-3 text-on-surface-muted">
                  <li><strong className="text-on-surface">Automatically Collected Information:</strong> When you browse our website, our servers automatically record information such as your IP address, browser type, pages visited, and the time spent on pages.</li>
                  <li><strong className="text-on-surface">Cookies:</strong> We use cookies to enhance your experience on our website.</li>
                  <li><strong className="text-on-surface">Analytics:</strong> We use analytics services to understand how users interact with our website.</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-3 text-xl sm:text-2xl font-semibold text-on-surface">How We Use Your Information</h2>
                <p className="mb-4 leading-7 text-on-surface-muted">We use the information we collect to:</p>
                <ul className="space-y-3 text-on-surface-muted">
                  <li>Improve and optimize our website</li>
                  <li>Understand user preferences and behavior</li>
                  <li>Monitor site performance</li>
                  <li>Detect and prevent abuse</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-3 text-xl sm:text-2xl font-semibold text-on-surface">Third-Party Links</h2>
                <p className="leading-7 text-on-surface-muted">
                  This website contains links to Amazon and other third-party websites. Please be aware that
                  we are not responsible for the privacy practices of these external sites. We encourage you
                  to read the privacy policies of any external websites before providing your personal information.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl sm:text-2xl font-semibold text-on-surface">Data Security</h2>
                <p className="leading-7 text-on-surface-muted">
                  We implement appropriate technical and organizational measures to protect your information
                  against unauthorized access, alteration, disclosure, or destruction. However, no website or
                  internet transmission is completely secure.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl sm:text-2xl font-semibold text-on-surface">Children&apos;s Privacy</h2>
                <p className="leading-7 text-on-surface-muted">
                  Our website is not intended for children under the age of 13. We do not knowingly collect
                  personal information from children. If we become aware that we have collected personal
                  information from a child, we will take steps to delete such information promptly.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl sm:text-2xl font-semibold text-on-surface">Changes to This Policy</h2>
                <p className="leading-7 text-on-surface-muted">
                  We may update this Privacy Policy periodically to reflect changes in our practices.
                  We encourage you to review this policy regularly.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-xl sm:text-2xl font-semibold text-on-surface">Contact Us</h2>
                <p className="leading-7 text-on-surface-muted">
                  If you have questions about this Privacy Policy or our privacy practices, please contact
                  us at{' '}
                  <a href="mailto:info@gga.com" className="font-semibold text-primary hover:underline">
                    info@gga.com
                  </a>
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
