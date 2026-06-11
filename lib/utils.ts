export function formatAED(n: number) {
  return `AED ${Number(n).toLocaleString('en-AE', { maximumFractionDigits: 0 })}`;
}

export function slugify(s: string) {
  return (
    s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') +
    '-' + Math.random().toString(36).slice(2, 7)
  );
}
