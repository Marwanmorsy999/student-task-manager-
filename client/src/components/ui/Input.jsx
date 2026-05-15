export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-[var(--text-2)]">
          {label}
        </label>
      )}
      <input
        className={`input-base ${error ? 'border-[var(--high)]' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-[var(--high)] font-medium">{error}</p>
      )}
    </div>
  );
}
