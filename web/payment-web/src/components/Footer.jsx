import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand-col">
          <Link to="/" className="footer-brand" aria-label="Settld home">
            <span className="footer-logo-shell">
              <img src={logo} alt="" />
            </span>
            <span className="footer-wordmark">Settld.</span>
          </Link>
          <p className="footer-tagline">
            Split the bill, not your friendships. Scan a receipt, tap who had what, get paid instantly.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Instagram" className="footer-social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" aria-label="X / Twitter" className="footer-social-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21.5l-7.42 8.477L23 22h-6.83l-5.35-6.997L4.7 22H1.44l7.93-9.07L1 2h6.98l4.838 6.39L18.244 2zm-1.2 18h1.885L6.03 3.9H4.01l13.034 16.1z"/></svg>
            </a>
            <a href="#" aria-label="TikTok" className="footer-social-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.321 5.562a5.124 5.124 0 0 1-3.414-1.267 5.126 5.126 0 0 1-1.537-2.775H10.66v13.31c0 1.465-1.187 2.652-2.652 2.652-1.464 0-2.652-1.187-2.652-2.652 0-1.464 1.188-2.652 2.652-2.652.265 0 .522.04.764.113v-3.71a6.363 6.363 0 0 0-.764-.046C4.555 8.535 2 11.09 2 14.25c0 3.16 2.555 5.715 5.715 5.715 3.16 0 5.715-2.555 5.715-5.715V8.918a8.48 8.48 0 0 0 4.891 1.555V6.76a5.15 5.15 0 0 1-.5-.197z"/></svg>
            </a>
          </div>
        </div>

        <div className="footer-nav">
          <div className="footer-col">
            <h4 className="footer-col-title">Product</h4>
            <Link to="/#features" className="footer-link">Features</Link>
            <Link to="/#how" className="footer-link">How it works</Link>
            <a href="#download" className="footer-link">Download</a>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <Link to="/marketing" className="footer-link">Press &amp; brand</Link>
            <a href="mailto:hello@settld.live" className="footer-link">Contact</a>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Support</h4>
            <Link to="/support" className="footer-link">Help center</Link>
            <Link to="/#faq" className="footer-link">FAQ</Link>
            <a href="mailto:support@settld.live" className="footer-link">Email us</a>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Legal</h4>
            <Link to="/privacy" className="footer-link">Privacy</Link>
            <a href="#" className="footer-link">Terms</a>
          </div>
        </div>
      </div>

      <div className="footer-bar">
        <div className="container footer-bar-inner">
          <span>© {new Date().getFullYear()} Settld. All rights reserved.</span>
          <span className="footer-made">Made for friends who can't do math at dinner.</span>
        </div>
      </div>
    </footer>
  );
}
