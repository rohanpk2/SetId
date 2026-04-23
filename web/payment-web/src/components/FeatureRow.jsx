import PhoneFrame from './PhoneFrame.jsx';
import './FeatureRow.css';

export default function FeatureRow({
  index,
  eyebrow,
  title,
  titleAccent,
  body,
  bullets = [],
  image,
  imageAlt,
  reverse = false,
  tilt = 0,
}) {
  return (
    <article className={`feat-row ${reverse ? 'feat-row-reverse' : ''}`}>
      <div className="feat-copy">
        <div className="feat-badge">
          <span className="feat-index">{String(index).padStart(2, '0')}</span>
          <span className="feat-eyebrow">{eyebrow}</span>
        </div>
        <h3 className="feat-title">
          {title} <span className="feat-title-accent">{titleAccent}</span>
        </h3>
        <p className="feat-body">{body}</p>
        {bullets.length > 0 && (
          <ul className="feat-bullets">
            {bullets.map((b, i) => (
              <li key={i} className="feat-bullet">
                <span className="feat-bullet-dot" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="feat-visual">
        <div className="feat-backdrop" aria-hidden="true"></div>
        <PhoneFrame src={image} alt={imageAlt} tilt={tilt} size="md" className="feat-phone" />
      </div>
    </article>
  );
}
