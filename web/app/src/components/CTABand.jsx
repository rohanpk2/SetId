import './CTABand.css';

const APPSTORE_URL = '#';
const PLAYSTORE_URL = '#';

export default function CTABand() {
  return (
    <section className="cta-band" id="download">
      <div className="cta-glow cta-glow-a" aria-hidden="true" />
      <div className="cta-glow cta-glow-b" aria-hidden="true" />

      <div className="container cta-inner">
        <p className="cta-eyebrow">GET SETTLD</p>
        <h2 className="cta-title">
          Stop chasing friends<br />for money.
        </h2>
        <p className="cta-sub">
          Download the app and settle your first bill in under a minute.
        </p>

        <div className="cta-badges">
          <a href={APPSTORE_URL} className="store-badge" aria-label="Download on the App Store">
            <svg className="store-logo" width="28" height="28" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
            <div className="store-badge-text">
              <span className="store-badge-top">Download on the</span>
              <span className="store-badge-name">App Store</span>
            </div>
          </a>
          <a href={PLAYSTORE_URL} className="store-badge" aria-label="Get it on Google Play">
            <svg className="store-logo" width="26" height="28" viewBox="0 0 512 512" fill="none"><path d="M325.3 234.3 104.3 13.3c-5.3-5.3-13-7.3-20.3-5.3l221 221 20.3-10.7 0 16zM39.7 25.3C27 30 18.7 42 18.7 57.3v397.3c0 15.3 8.3 27.3 21 32L253 266.7 39.7 25.3zm429.2 202.1L393 190.7 308.7 275l84.3 84.3 75.8-41.6c20.9-11.2 20.9-40.3.1-51.3zm-385.1 272L325.3 278.3v-.7L104.3 498.7c7.3 2 15 0 20.5-4.7z" fill="currentColor"/></svg>
            <div className="store-badge-text">
              <span className="store-badge-top">GET IT ON</span>
              <span className="store-badge-name">Google Play</span>
            </div>
          </a>
        </div>

        <p className="cta-note">
          Free to download · No fees for payers · Available on iOS &amp; Android
        </p>
      </div>
    </section>
  );
}
