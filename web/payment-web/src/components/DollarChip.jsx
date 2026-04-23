import './DollarChip.css';

export default function DollarChip({ style, size = 34, delay = 0 }) {
  const s = { ...style, width: size, height: size, animationDelay: `${delay}ms`, fontSize: size * 0.48 };
  return (
    <span className="dollar-chip" style={s} aria-hidden="true">$</span>
  );
}
