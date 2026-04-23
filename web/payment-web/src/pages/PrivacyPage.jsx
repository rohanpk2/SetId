import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import './PrivacyPage.css';

const LAST_UPDATED = 'April 23, 2026';

export default function PrivacyPage() {
  return (
    <>
      <Nav variant="light" />

      <article className="privacy">
        <header className="privacy-hero">
          <div className="container-narrow">
            <span className="eyebrow">Legal</span>
            <h1 className="display privacy-title">Privacy Policy</h1>
            <p className="privacy-meta">Last updated: {LAST_UPDATED}</p>
          </div>
        </header>

        <div className="container-narrow privacy-body">
          <div className="privacy-toc">
            <span className="privacy-toc-label">On this page</span>
            <ol>
              <li><a href="#intro">1. Introduction</a></li>
              <li><a href="#collect">2. Information we collect</a></li>
              <li><a href="#use">3. How we use your information</a></li>
              <li><a href="#share">4. Sharing &amp; disclosure</a></li>
              <li><a href="#retention">5. Data retention</a></li>
              <li><a href="#rights">6. Your rights</a></li>
              <li><a href="#security">7. Security</a></li>
              <li><a href="#children">8. Children</a></li>
              <li><a href="#changes">9. Changes to this policy</a></li>
              <li><a href="#contact">10. Contact us</a></li>
            </ol>
          </div>

          <section id="intro" className="privacy-section">
            <h2>1. Introduction</h2>
            <p>
              Settld ("Settld," "we," "us," or "our") operates a mobile application and website that
              help people split bills and collect payments from friends. This Privacy Policy
              describes the information we collect, how we use it, and the choices you have.
            </p>
            <p>
              By creating an account or using Settld, you agree to the practices described here. If
              you do not agree, please do not use our services.
            </p>
          </section>

          <section id="collect" className="privacy-section">
            <h2>2. Information we collect</h2>

            <h3>Account information</h3>
            <p>
              When you sign up, we collect your phone number for authentication and, optionally,
              your name, email address, and profile photo. We use a one-time passcode (OTP) sent
              via SMS to verify your phone number.
            </p>

            <h3>Payment information</h3>
            <p>
              We use <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">Stripe</a>{' '}
              to process all payments and payouts. We never see or store your full card numbers,
              bank account numbers, or CVV codes. Stripe provides us with a limited token and
              metadata (last four digits, card brand, expiration) so we can display your payout
              method in the app.
            </p>

            <h3>Receipt images &amp; OCR data</h3>
            <p>
              When you scan a receipt, we upload the image to our servers and extract line items,
              tax, tip, and merchant details using optical character recognition (OCR). Receipt
              images are processed, associated with your bill, and deleted after 90 days.
            </p>

            <h3>Bill &amp; contact information</h3>
            <p>
              When you split a bill, we store the participants you add, the amounts assigned to
              each, and payment status. If you add a friend by email or phone number, we store that
              contact so pay links can be delivered.
            </p>

            <h3>Device &amp; usage data</h3>
            <p>
              We automatically collect information about how you use the app, including device model,
              OS version, app version, language, IP address, crash logs, and performance metrics. We
              use this to diagnose issues and improve the product.
            </p>

            <h3>Cookies &amp; similar technologies</h3>
            <p>
              Our website and pay-links use cookies and local storage for session management and
              anti-fraud. We do not use third-party advertising cookies.
            </p>
          </section>

          <section id="use" className="privacy-section">
            <h2>3. How we use your information</h2>
            <ul>
              <li>To authenticate you and keep your account secure</li>
              <li>To process payments and payouts through Stripe</li>
              <li>To extract items from receipts you upload (OCR)</li>
              <li>To deliver pay links to participants you invite</li>
              <li>To notify you when someone pays you or when a bill changes state</li>
              <li>To prevent fraud, abuse, and violations of our terms</li>
              <li>To improve our product — fixing bugs, improving OCR accuracy, and shipping new features</li>
              <li>To respond to support requests and legal obligations</li>
            </ul>
          </section>

          <section id="share" className="privacy-section">
            <h2>4. Sharing &amp; disclosure</h2>
            <p>We share information only with the following categories of recipients:</p>

            <h3>Service providers</h3>
            <ul>
              <li><strong>Stripe</strong> — payment processing and payouts</li>
              <li><strong>Twilio</strong> — SMS delivery for OTP verification and notifications</li>
              <li><strong>Cloud hosting</strong> — Amazon Web Services (or equivalent) for database and image storage</li>
              <li><strong>Crash &amp; analytics</strong> — aggregated, anonymized product analytics to improve the app</li>
            </ul>

            <h3>Bill participants</h3>
            <p>
              When you invite someone to pay their share, we display your name and the bill details
              to that person via the pay link. Participants do not see your payout account or other
              bills.
            </p>

            <h3>Legal &amp; safety</h3>
            <p>
              We may disclose information to comply with law, respond to lawful requests, protect
              our rights and users, or investigate fraud.
            </p>

            <p>
              <strong>We never sell your personal information.</strong>
            </p>
          </section>

          <section id="retention" className="privacy-section">
            <h2>5. Data retention</h2>
            <ul>
              <li><strong>Receipt images:</strong> deleted 90 days after scan</li>
              <li><strong>Bill data:</strong> retained while your account is active, for your records</li>
              <li><strong>Account data:</strong> retained until you request deletion</li>
              <li><strong>Payment records:</strong> retained as required by financial regulations (typically 7 years)</li>
              <li><strong>Crash &amp; analytics:</strong> retained for up to 24 months, then aggregated</li>
            </ul>
          </section>

          <section id="rights" className="privacy-section">
            <h2>6. Your rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and associated data (subject to legal retention requirements)</li>
              <li>Export a copy of your data in a machine-readable format</li>
              <li>Object to or restrict certain processing</li>
              <li>Withdraw consent at any time where we rely on consent</li>
            </ul>
            <p>
              To exercise any of these rights, email{' '}
              <a href="mailto:privacy@settld.live">privacy@settld.live</a> from the address
              associated with your account. We respond within 30 days.
            </p>
            <p>
              If you are a California resident, you have additional rights under the CCPA/CPRA. If
              you are in the EEA or UK, you have rights under GDPR. We honor all applicable rights.
            </p>
          </section>

          <section id="security" className="privacy-section">
            <h2>7. Security</h2>
            <p>
              We use industry-standard security measures including TLS encryption in transit, AES
              encryption at rest, and strict access controls. Payment information is handled
              entirely by Stripe, which is PCI-DSS Level 1 certified. Phone-based authentication
              means there are no passwords to steal.
            </p>
            <p>
              No system is perfectly secure. If we become aware of a data breach affecting your
              account, we will notify you without undue delay.
            </p>
          </section>

          <section id="children" className="privacy-section">
            <h2>8. Children</h2>
            <p>
              Settld is not intended for anyone under 18. We do not knowingly collect data from
              children. If you believe a child has provided us information, email{' '}
              <a href="mailto:privacy@settld.live">privacy@settld.live</a> and we will delete it.
            </p>
          </section>

          <section id="changes" className="privacy-section">
            <h2>9. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. If we make material changes, we
              will notify you by email or in-app notification before the changes take effect. The
              "Last updated" date at the top of this page always reflects the current version.
            </p>
          </section>

          <section id="contact" className="privacy-section">
            <h2>10. Contact us</h2>
            <p>
              Questions about this Privacy Policy, or privacy in general, can be sent to:
            </p>
            <p>
              <a href="mailto:privacy@settld.live">privacy@settld.live</a><br />
              Settld, Inc.
            </p>
          </section>

          <div className="privacy-disclaimer">
            <strong>Template notice:</strong> This Privacy Policy is a good-faith draft based on the
            data Settld collects. Before publication, have this reviewed by qualified legal counsel
            to ensure compliance with all applicable laws in your jurisdictions of operation
            (including GDPR, CCPA/CPRA, and any state-specific statutes).
          </div>
        </div>
      </article>

      <Footer />
    </>
  );
}
