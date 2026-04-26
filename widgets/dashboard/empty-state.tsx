interface EmptyStateProps {
  title: string;
  description?: string;
  hint?: string;
}

export function EmptyState({ title, description, hint }: EmptyStateProps) {
  return (
    <div className="flex min-h-[12rem] flex-col items-center justify-center rounded-[22px] border border-dashed border-[color:var(--border)] bg-[color:var(--bg-2)] px-6 py-10 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--surface)] text-[color:var(--text-dim)]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div className="text-sm font-semibold text-[color:var(--text)]">{title}</div>
      {description && (
        <p className="mt-2 max-w-sm text-xs leading-5 text-[color:var(--text-dim)]">{description}</p>
      )}
      {hint && (
        <p className="mt-3 max-w-sm text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{hint}</p>
      )}
    </div>
  );
}
