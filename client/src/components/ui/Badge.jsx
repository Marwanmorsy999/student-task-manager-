export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default:  'bg-[var(--surface-2)] text-[var(--text-2)] border border-[var(--border)]',
    high:     'bg-[var(--high-bg)] text-[var(--high)]',
    medium:   'bg-[var(--med-bg)] text-[var(--med)]',
    low:      'bg-[var(--low-bg)] text-[var(--low)]',
    accent:   'bg-[var(--accent-2)] text-[var(--accent)]',
    today:    'bg-[var(--accent-2)] text-[var(--accent)]',
    tomorrow: 'bg-[var(--med-bg)] text-[var(--med)]',
    overdue:  'bg-[var(--high-bg)] text-[var(--high)]',
    soon:     'bg-[var(--med-bg)] text-[var(--med)]',
  };

  return (
    <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
