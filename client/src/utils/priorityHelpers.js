export const PRIORITY_CONFIG = {
  high:   { label: '🔴 Urgent', textClass: 'text-[var(--high)]',  bgClass: 'bg-[var(--high-bg)]'  },
  medium: { label: '🟡 Medium', textClass: 'text-[var(--med)]',   bgClass: 'bg-[var(--med-bg)]'   },
  low:    { label: '🟢 Low',    textClass: 'text-[var(--low)]',   bgClass: 'bg-[var(--low-bg)]'   },
};

export const STATUS_CONFIG = {
  pending:     { label: 'Pending',     color: 'var(--text-3)' },
  'in-progress': { label: 'In Progress', color: 'var(--med)'    },
  done:        { label: 'Done',        color: 'var(--low)'    },
};
