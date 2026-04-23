import './FloatingReceipt.css';

/**
 * Tiny animated paper-receipt decoration. Mirrors the mobile LandingScreen
 * FloatingReceipt component but implemented with pure CSS keyframes.
 */
export default function FloatingReceipt({ style, rotate = 0, delay = 0, size = 'md' }) {
  const wrapStyle = {
    ...style,
    transform: `rotate(${rotate}deg)`,
    animationDelay: `${delay}ms`,
  };
  return (
    <div className={`float-receipt float-receipt-${size}`} style={wrapStyle} aria-hidden="true">
      <div className="float-line" style={{ width: '70%' }} />
      <div className="float-line" />
      <div className="float-line" style={{ width: '85%' }} />
      <div className="float-line" />
      <div className="float-line float-line-green" style={{ width: '50%' }} />
    </div>
  );
}
