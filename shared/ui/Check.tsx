export function Check({ accent }: { accent?: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      className="mt-1 shrink-0"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 7.5L5.5 11L12 3.5"
        stroke={accent ? "var(--accent)" : "var(--text-dim)"}
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}
