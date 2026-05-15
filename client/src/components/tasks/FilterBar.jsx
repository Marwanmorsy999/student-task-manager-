export default function FilterBar({ filters, onChange }) {
  const set = (k, v) => onChange({ ...filters, [k]: v });

  const seg = (val, label) => (
    <button
      key={val}
      onClick={() => set('status', val)}
      className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
        filters.status === val
          ? 'bg-[var(--accent)] text-white shadow-accent'
          : 'text-[var(--text-2)] hover:bg-[var(--accent-2)] hover:text-[var(--accent)]'
      }`}
    >
      {label}
    </button>
  );

  const categories = ['General', 'Math', 'Science', 'Programming', 'Literature', 'Other'];

  return (
    <div className="card p-3 flex items-center gap-3 flex-wrap mb-3">
      {/* Search */}
      <div className="flex-1 min-w-40 flex items-center gap-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3 py-2 focus-within:border-[var(--accent)] transition-colors">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[var(--text-3)] flex-shrink-0">
          <circle cx="7" cy="7" r="5"/><path d="M11.5 11.5l2.5 2.5" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          placeholder="Search tasks…"
          value={filters.search || ''}
          onChange={(e) => set('search', e.target.value)}
          className="bg-transparent border-none outline-none text-sm font-medium text-[var(--text)] placeholder:text-[var(--text-3)] w-full"
        />
      </div>

      <div className="w-px h-7 bg-[var(--border)] hidden sm:block" />

      {/* Priority filter */}
      <select
        value={filters.priority || 'all'}
        onChange={(e) => set('priority', e.target.value)}
        className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm font-semibold text-[var(--text-2)] focus:outline-none focus:border-[var(--accent)] appearance-none cursor-pointer"
      >
        <option value="all">All Priorities</option>
        <option value="high">🔴 High</option>
        <option value="medium">🟡 Medium</option>
        <option value="low">🟢 Low</option>
      </select>

      {/* Category filter */}
      <select
        value={filters.category || 'all'}
        onChange={(e) => set('category', e.target.value)}
        className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm font-semibold text-[var(--text-2)] focus:outline-none focus:border-[var(--accent)] appearance-none cursor-pointer"
      >
        <option value="all">All Categories</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <div className="w-px h-7 bg-[var(--border)] hidden sm:block" />

      {/* Status segments */}
      <div className="flex gap-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-1">
        {seg('all', 'All')}
        {seg('pending', 'Pending')}
        {seg('in-progress', 'Active')}
        {seg('done', 'Done')}
      </div>
    </div>
  );
}
