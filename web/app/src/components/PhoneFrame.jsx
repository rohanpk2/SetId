import './PhoneFrame.css';

/**
 * CSS-only iPhone 15 Pro frame for product screenshots.
 * The image should be a tall portrait screenshot (roughly 9:19.5).
 */
export default function PhoneFrame({ src, alt = '', tilt = 0, size = 'md', className = '' }) {
  const style = tilt ? { transform: `rotate(${tilt}deg)` } : undefined;
  return (
    <div className={`phone phone-${size} ${className}`.trim()} style={style}>
      <div className="phone-side phone-side-left">
        <span className="phone-btn phone-btn-mute"></span>
        <span className="phone-btn phone-btn-vol"></span>
        <span className="phone-btn phone-btn-vol"></span>
      </div>
      <div className="phone-side phone-side-right">
        <span className="phone-btn phone-btn-power"></span>
      </div>

      <div className="phone-body">
        <div className="phone-screen">
          <img src={src} alt={alt} loading="lazy" />
          <div className="phone-island" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  );
}
