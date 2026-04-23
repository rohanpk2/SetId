import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import dashboardImg from '../assets/IMG_4972.PNG';
import assignImg from '../assets/IMG_4973.PNG';
import splitImg from '../assets/IMG_4975.PNG';
import shareImg from '../assets/IMG_4974.PNG';
import trackImg from '../assets/IMG_4976.PNG';
import logo from '../assets/logo.png';
import './MarketingPage.css';

const PALETTE = [
  { name: 'Brand Landing',    value: '#105D4B', text: '#ffffff' },
  { name: 'Brand Landing Dim', value: '#0d4a3c', text: '#ffffff' },
  { name: 'Mint 1',           value: '#4FD1A7', text: '#0d4a3c' },
  { name: 'Mint 2',           value: '#1FA87A', text: '#ffffff' },
  { name: 'Mint Tint',        value: '#E6F4F0', text: '#105D4B' },
  { name: 'Ink Strong',       value: '#111827', text: '#ffffff' },
];

const SCREENSHOTS = [
  { src: dashboardImg, caption: 'Dashboard' },
  { src: assignImg,    caption: 'Assign items' },
  { src: splitImg,     caption: 'Split between members' },
  { src: shareImg,     caption: 'Share pay link' },
  { src: trackImg,     caption: 'Payment tracking' },
];

export default function MarketingPage() {
  return (
    <>
      <Nav variant="light" />

      <section className="mk-hero">
        <div className="container">
          <span className="eyebrow">Press &amp; brand</span>
          <h1 className="display mk-hero-title">
            The <span className="display-accent">Settld</span> press kit.
          </h1>
          <p className="body-lg mk-hero-sub">
            Everything you need to write about, cover, or partner with Settld: logos, colors,
            product screenshots, and the short version of our story.
          </p>
          <div className="mk-hero-ctas">
            <a href="#assets" className="btn btn-primary">Download assets</a>
            <a href="mailto:press@settld.live" className="btn btn-dark">Press inquiries</a>
          </div>
        </div>
      </section>

      {/* ── Story ────────────────────────────────────────────── */}
      <section className="mk-story section-sm">
        <div className="container-narrow">
          <span className="eyebrow">Our story</span>
          <h2 className="display mk-story-title">
            We got tired of <span className="display-accent">doing the math.</span>
          </h2>
          <p className="mk-story-body">
            Every group dinner ends the same way: one person pulls out a calculator, another tries
            to Venmo, and somebody always pays more than they should. We built Settld because
            splitting a bill shouldn&rsquo;t be a group project.
          </p>
          <p className="mk-story-body">
            Today, Settld lets you scan any receipt, tap who had what, and send a pay link that
            friends open in any browser. No app, no signup, no "I&rsquo;ll get you later." Money
            moves in seconds. The awkward math is gone.
          </p>
          <div className="mk-stats">
            <div className="mk-stat">
              <div className="mk-stat-num">2025</div>
              <div className="mk-stat-label">Founded</div>
            </div>
            <div className="mk-stat">
              <div className="mk-stat-num">US</div>
              <div className="mk-stat-label">Launch market</div>
            </div>
            <div className="mk-stat">
              <div className="mk-stat-num">iOS + Android</div>
              <div className="mk-stat-label">Platforms</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Logo ─────────────────────────────────────────────── */}
      <section className="mk-logos section-sm" id="assets">
        <div className="container">
          <div className="mk-head">
            <span className="eyebrow">Logo</span>
            <h2 className="display">Our mark.</h2>
            <p className="body">
              Use the full lockup wherever possible. The logomark alone works at small sizes
              (favicons, app icons). Maintain padding equal to the height of the "S".
            </p>
          </div>

          <div className="mk-logo-grid">
            <div className="mk-logo-card">
              <div className="mk-logo-preview mk-logo-light">
                <img src={logo} alt="Settld logo" />
                <span className="mk-wordmark">Settld.</span>
              </div>
              <div className="mk-logo-meta">
                <span>Light background</span>
                <a href="#" className="mk-download">SVG · PNG</a>
              </div>
            </div>
            <div className="mk-logo-card">
              <div className="mk-logo-preview mk-logo-dark">
                <img src={logo} alt="Settld logo" />
                <span className="mk-wordmark">Settld.</span>
              </div>
              <div className="mk-logo-meta">
                <span>Dark background</span>
                <a href="#" className="mk-download">SVG · PNG</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Palette ──────────────────────────────────────────── */}
      <section className="mk-palette section-sm">
        <div className="container">
          <div className="mk-head">
            <span className="eyebrow">Colors</span>
            <h2 className="display">The palette.</h2>
            <p className="body">
              Greens do the heavy lifting. Use Brand Landing for bold moments, Mint 2 for interaction
              and action, and Mint Tint for backgrounds. Ink Strong for body type.
            </p>
          </div>

          <div className="mk-palette-grid">
            {PALETTE.map((c) => (
              <div key={c.name} className="mk-swatch" style={{ background: c.value, color: c.text }}>
                <div className="mk-swatch-name">{c.name}</div>
                <div className="mk-swatch-hex">{c.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Screenshots ──────────────────────────────────────── */}
      <section className="mk-shots section-sm">
        <div className="container">
          <div className="mk-head">
            <span className="eyebrow">Screenshots</span>
            <h2 className="display">Product shots.</h2>
            <p className="body">
              Taken from the production iOS app. Feel free to use in editorial contexts with
              attribution to Settld.
            </p>
          </div>

          <div className="mk-shots-grid">
            {SCREENSHOTS.map((s) => (
              <figure key={s.caption} className="mk-shot">
                <img src={s.src} alt={s.caption} loading="lazy" />
                <figcaption>{s.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Press contact ────────────────────────────────────── */}
      <section className="mk-press section-sm">
        <div className="container">
          <div className="mk-press-card">
            <div>
              <span className="eyebrow eyebrow-mint">Media inquiries</span>
              <h2 className="mk-press-title">
                Writing about us? Let&rsquo;s talk.
              </h2>
              <p className="mk-press-sub">
                For interviews, partnerships, or product demos, reach out to our press team. We
                reply within 24 hours.
              </p>
            </div>
            <a href="mailto:press@settld.live" className="btn btn-white btn-lg">
              press@settld.live
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
