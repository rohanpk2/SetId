import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import PhoneFrame from '../components/PhoneFrame.jsx';
import FloatingReceipt from '../components/FloatingReceipt.jsx';
import DollarChip from '../components/DollarChip.jsx';
import FeatureRow from '../components/FeatureRow.jsx';
import CTABand from '../components/CTABand.jsx';
import FAQ from '../components/FAQ.jsx';

import dashboardImg from '../assets/IMG_4972.PNG';
import assignImg from '../assets/IMG_4973.PNG';
import shareImg from '../assets/IMG_4974.PNG';
import splitImg from '../assets/IMG_4975.PNG';
import trackImg from '../assets/IMG_4976.PNG';

import './LandingPage.css';

const FAQ_ITEMS = [
  {
    q: 'How does Settld split a bill?',
    a: 'Snap a photo of the receipt. Settld uses OCR to pull every item, tax, and tip automatically. Tap who had what, and the math happens instantly — down to the cent.',
  },
  {
    q: 'Do my friends need the app to pay me?',
    a: 'No. You just share a payment link (iMessage, WhatsApp, AirDrop — anything). They open it in any browser and pay with Apple Pay, card, or bank. The app is only required for the person collecting.',
  },
  {
    q: 'Are there any fees?',
    a: 'Settld is free to download and free for your friends to pay. Standard Stripe processing fees may apply to the collecting account — we never charge hidden fees on top.',
  },
  {
    q: 'How fast do I get paid?',
    a: 'Payments land in your connected account instantly for most methods, or within 1–2 business days for bank transfers. You can track collection progress in real time.',
  },
  {
    q: 'Is my payment info safe?',
    a: 'Yes. We never touch or store card numbers. All payments run through Stripe, a PCI-DSS Level 1 certified provider trusted by millions of businesses.',
  },
  {
    q: 'What happens if someone pays me in cash?',
    a: 'You can mark any participant as paid manually. Settld updates the collection tracker so you always know who\u2019s squared up.',
  },
];

export default function LandingPage() {
  return (
    <>
      <Nav variant="dark" />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-glow hero-glow-a" />
          <div className="hero-glow hero-glow-b" />
          <div className="hero-grid" />
        </div>

        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="hero-eyebrow">The end of awkward math</span>
            <h1 className="hero-title">
              Split the bill,<br />
              not your friendships.
            </h1>
            <p className="hero-sub">
              Scan a receipt. Tap who had what. Get paid — instantly. Settld turns the dinner-table
              calculator moment into a 10-second tap.
            </p>
            <div className="hero-ctas">
              <a href="#download" className="btn btn-white btn-lg">
                Get the app
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
              <a href="#how" className="btn btn-ghost btn-lg">See how it works</a>
            </div>
            <p className="hero-trust">
              Free to start · No fees for payers · 60-second setup
            </p>
          </div>

          <div className="hero-visual">
            <div className="hero-phone-wrap">
              <FloatingReceipt style={{ top: '8%',  left: '-8%' }}  rotate={-14} delay={0}    size="md" />
              <FloatingReceipt style={{ top: '22%', right: '-6%' }} rotate={18}  delay={400}  size="sm" />
              <FloatingReceipt style={{ bottom: '14%', left: '-10%' }} rotate={8} delay={800} size="sm" />

              <DollarChip style={{ top: '14%',  right: '8%' }}  size={40} delay={200} />
              <DollarChip style={{ bottom: '22%', right: '-4%' }} size={34} delay={600} />
              <DollarChip style={{ bottom: '6%', left: '18%' }}  size={28} delay={1000} />

              <PhoneFrame src={dashboardImg} alt="Settld dashboard on iPhone" size="lg" tilt={-3} />
            </div>
          </div>
        </div>

        <div className="hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none"><path d="M0,48 C240,96 480,0 720,32 C960,64 1200,16 1440,48 L1440,80 L0,80 Z" fill="#f8f9fa"/></svg>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────────────── */}
      <section className="stats">
        <div className="container stats-inner">
          <div className="stat">
            <div className="stat-num">$0</div>
            <div className="stat-label">Fees for payers</div>
          </div>
          <div className="stat-divider" aria-hidden="true" />
          <div className="stat">
            <div className="stat-num">3 taps</div>
            <div className="stat-label">To settle a bill</div>
          </div>
          <div className="stat-divider" aria-hidden="true" />
          <div className="stat">
            <div className="stat-num">60s</div>
            <div className="stat-label">Average setup time</div>
          </div>
          <div className="stat-divider" aria-hidden="true" />
          <div className="stat">
            <div className="stat-num">No signup</div>
            <div className="stat-label">Required for payers</div>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section className="how section" id="how">
        <div className="container how-head">
          <span className="eyebrow">How it works</span>
          <h2 className="display how-title">
            From receipt to <span className="display-accent">settled</span> in three taps.
          </h2>
          <p className="body-lg how-lead">
            No spreadsheets. No group-chat math. No "I'll get you later." Just scan, assign, and share.
          </p>
        </div>

        <div className="container">
          <FeatureRow
            index={1}
            eyebrow="Scan"
            title="Snap it."
            titleAccent="We'll read the fine print."
            body="Point your camera at any receipt. Settld pulls every item, tax, and tip in seconds — no typing, no re-entering prices you already paid for."
            bullets={[
              'OCR trained on real-world restaurant receipts',
              'Works on crumpled, faded, or handwritten totals',
              'Edit any line before assigning — just in case',
            ]}
            image={assignImg}
            imageAlt="Settld scanning a Texas Roadhouse receipt"
            tilt={-2}
          />

          <FeatureRow
            index={2}
            eyebrow="Assign"
            title="Tap to assign."
            titleAccent="Math does itself."
            body="Drop items onto your friends, or share them evenly. Tax and tip split proportionally — down to the cent. Nobody gets stuck paying for the steak they didn't order."
            bullets={[
              'Split any item between 2 or more people',
              'Proportional tax and tip, no awkward rounding',
              'Live totals per person as you assign',
            ]}
            image={splitImg}
            imageAlt="Assigning items to Arjun and Jane"
            tilt={2}
            reverse
          />

          <FeatureRow
            index={3}
            eyebrow="Share"
            title="One link."
            titleAccent="Everyone pays."
            body="Send a pay link through iMessage, WhatsApp, or AirDrop. Your friends open it in any browser and pay with Apple Pay, card, or bank — no app required on their end."
            bullets={[
              'Works on iOS, Android, and desktop browsers',
              'Apple Pay, Google Pay, cards, and bank transfer',
              'No signup or account needed to pay you',
            ]}
            image={shareImg}
            imageAlt="Sharing the pay-your-share link via iOS share sheet"
            tilt={-2}
          />
        </div>
      </section>

      {/* ── Track band ────────────────────────────────────────── */}
      <section className="track">
        <div className="container track-inner">
          <div className="track-copy">
            <span className="eyebrow">Track</span>
            <h2 className="display track-title">
              Know the moment you're <span className="display-accent">settled.</span>
            </h2>
            <p className="body-lg track-body">
              Real-time collection tracking means you always know who's paid and who's still dragging
              their feet. No more combing through Venmo to figure out who owes what.
            </p>
            <ul className="track-bullets">
              <li>Live progress bar as each friend pays</li>
              <li>One-tap reminders when someone forgets</li>
              <li>Mark cash payments manually — the tracker keeps up</li>
              <li>Every bill archived so you never lose a record</li>
            </ul>
          </div>
          <div className="track-visual">
            <PhoneFrame src={trackImg} alt="Payment tracking screen showing collection progress" size="lg" tilt={3} />
          </div>
        </div>
      </section>

      {/* ── Features grid ─────────────────────────────────────── */}
      <section className="features section" id="features">
        <div className="container">
          <div className="features-head">
            <span className="eyebrow">Why Settld</span>
            <h2 className="display features-title">
              Everything you need.<br />
              <span className="display-accent">Nothing you don't.</span>
            </h2>
          </div>

          <div className="features-grid">
            {FEATURES.map((f) => (
              <article key={f.title} className="feature-card">
                <div className="feature-icon" aria-hidden="true">{f.icon}</div>
                <h3 className="feature-card-title">{f.title}</h3>
                <p className="feature-card-body">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="faq section" id="faq">
        <div className="container">
          <div className="faq-head">
            <span className="eyebrow">FAQ</span>
            <h2 className="display faq-title">
              Questions, <span className="display-accent">answered.</span>
            </h2>
          </div>
          <FAQ items={FAQ_ITEMS} />
          <p className="faq-footer">
            Still have questions? <a href="/support">Visit the help center →</a>
          </p>
        </div>
      </section>

      <CTABand />
      <Footer />
    </>
  );
}

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="8" y2="15"/></svg>
    ),
    title: 'Apple Pay & cards',
    body: 'Every major payment method — Apple Pay, Google Pay, Visa, Mastercard, Amex, Discover.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
    ),
    title: 'Instant payouts',
    body: 'Money hits your account instantly for most methods, 1–2 business days for bank transfers.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 3v2M16 3v2"/></svg>
    ),
    title: 'OCR receipt scan',
    body: 'Trained on real receipts. Pulls items, tax, and tip in under 3 seconds — no retyping.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    ),
    title: 'Tax & tip to the cent',
    body: 'Proportional splitting means nobody overpays on the tax or tip for items they didn\u2019t order.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
    ),
    title: 'No signup for payers',
    body: 'Friends open a link in any browser and pay in seconds. Zero friction. Zero excuses.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    ),
    title: 'Bank-level security',
    body: 'Powered by Stripe. PCI-DSS Level 1 certified. We never see or store card numbers.',
  },
];
