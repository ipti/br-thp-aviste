// Use UTC methods to avoid timezone shift when displaying date-only values
// stored as midnight UTC (e.g. 2026-05-06T00:00:00.000Z → "06/05/2026", not "05/05/2026")
const utcToBr = (d: Date): string =>
  `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`;

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  return utcToBr(typeof date === 'string' ? new Date(date) : date);
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('pt-BR');
};

// ISO DateTime → DD/MM/YYYY for form inputs
export const isoToBr = (iso?: string | null): string => {
  if (!iso) return '';
  return utcToBr(new Date(iso));
};

// DD/MM/YYYY → YYYY-MM-DD for API
export const brToIso = (br: string): string => {
  if (!br || br.length < 10) return br;
  const [d, m, y] = br.split('/');
  return `${y}-${m}-${d}`;
};
