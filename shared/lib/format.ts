export const fmtK = (n: number) => `${n}K ₸`;

export const fmtDelta = (n: number) =>
  `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
