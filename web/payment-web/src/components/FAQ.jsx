import { useState } from 'react';
import './FAQ.css';

export default function FAQ({ items }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="faq-list">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}>
            <button
              type="button"
              className="faq-q"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span className="faq-q-text">{item.q}</span>
              <span className="faq-q-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </span>
            </button>
            <div className="faq-a" role="region">
              <p>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
