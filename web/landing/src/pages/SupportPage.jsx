import { useState } from 'react';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import FAQ from '../components/FAQ.jsx';
import './SupportPage.css';

const SUPPORT_EMAIL = 'support@settld.live';

const CATEGORIES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 6 6 .9-4.5 4.4L18 20l-6-3.2L6 20l1.5-6.7L3 8.9 9 8z"/></svg>
    ),
    title: 'Getting started',
    body: 'Set up your account, connect payouts, and scan your first bill.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
    ),
    title: 'Payments & payouts',
    body: 'Pay-link issues, refunds, bank transfers, and instant payout timing.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    ),
    title: 'Privacy & security',
    body: 'How we handle your data, account deletion, and payment security.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'My friend can\u2019t open the pay link — what do I do?',
    a: 'Most pay-link issues are caused by iMessage link previews. Have them long-press the link and choose "Open in Safari" (or copy-paste into their browser). If it still won\u2019t load, email us and we\u2019ll regenerate a fresh link.',
  },
  {
    q: 'I scanned a receipt and the items are wrong.',
    a: 'Tap "Edit Items" on the bill screen to correct any line item, price, tax, or tip before assigning. Your edits never re-trigger the OCR, so manual corrections always win.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Open Profile → Settings → Delete account. This permanently removes your bills, scanned receipts, and payout connection. For cash-in-flight questions, email us before deleting.',
  },
  {
    q: 'My payout didn\u2019t arrive.',
    a: 'Instant payouts typically land within 30 minutes. Standard bank transfers take 1–2 business days. If it\u2019s been longer, email support with the bill ID and we\u2019ll trace it with Stripe.',
  },
  {
    q: 'Can I use Settld outside the US?',
    a: 'Right now Settld supports US-issued bank accounts and debit cards for collectors. Payers can be anywhere — if their card supports international transactions, the link will work.',
  },
  {
    q: 'A friend paid me in cash. How do I mark them paid?',
    a: 'Open the bill → Payment Tracking → "Mark Others as Paid" and select the participant. Their status flips to PAID and the collection bar updates.',
  },
];

export default function SupportPage() {
  const [state, setState] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const onChange = (e) => setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Support request from ${state.name || 'a customer'}`);
    const body = encodeURIComponent(`${state.message}\n\n—\nFrom: ${state.name} <${state.email}>`);
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <>
      <Nav variant="light" />

      <section className="support-hero">
        <div className="container">
          <span className="eyebrow">Support</span>
          <h1 className="display support-hero-title">
            How can we <span className="display-accent">help?</span>
          </h1>
          <p className="body-lg support-hero-sub">
            Answers to common questions, and a direct line to a human when you need one.
          </p>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="btn btn-primary support-hero-cta">
            Email support
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>
      </section>

      <section className="support-cats section-sm">
        <div className="container">
          <div className="cat-grid">
            {CATEGORIES.map((c) => (
              <article key={c.title} className="cat-card">
                <div className="cat-icon">{c.icon}</div>
                <h3 className="cat-title">{c.title}</h3>
                <p className="cat-body">{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="support-faq section-sm">
        <div className="container">
          <div className="support-faq-head">
            <span className="eyebrow">Common questions</span>
            <h2 className="display">Troubleshooting &amp; how-tos</h2>
          </div>
          <FAQ items={FAQ_ITEMS} />
        </div>
      </section>

      <section className="support-contact section-sm">
        <div className="container">
          <div className="contact-card">
            <div className="contact-copy">
              <span className="eyebrow">Contact us</span>
              <h2 className="display contact-title">
                Didn&rsquo;t find what you needed?
              </h2>
              <p className="body contact-sub">
                Send a message and we&rsquo;ll reply within 24 hours. For urgent payment issues include
                the bill ID and the payer&rsquo;s email.
              </p>
              <ul className="contact-meta">
                <li>
                  <span className="contact-meta-label">Email</span>
                  <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
                </li>
                <li>
                  <span className="contact-meta-label">Response time</span>
                  <span>Within 24 hours (Mon–Fri)</span>
                </li>
              </ul>
            </div>

            <form className="contact-form" onSubmit={onSubmit}>
              <label className="contact-field">
                <span>Your name</span>
                <input name="name" value={state.name} onChange={onChange} required placeholder="Jane Doe" />
              </label>
              <label className="contact-field">
                <span>Email</span>
                <input name="email" type="email" value={state.email} onChange={onChange} required placeholder="jane@example.com" />
              </label>
              <label className="contact-field">
                <span>How can we help?</span>
                <textarea name="message" rows={5} value={state.message} onChange={onChange} required placeholder="Describe the issue — include bill ID if you have one." />
              </label>
              <button type="submit" className="btn btn-primary contact-submit">
                {sent ? 'Opening your email app…' : 'Send message'}
              </button>
              <p className="contact-note">
                This opens your email client with the message pre-filled. No form tracking, no spam.
              </p>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
