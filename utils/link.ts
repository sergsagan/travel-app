export function hasValidTo(to: unknown): boolean {
  if (!to) return false;
  if (typeof to === 'string') return true;
  if (typeof to !== 'object') return false;
  const t = to as Record<string, any>;
  if (!t.params) return true;
  try {
    const vals = Object.values(t.params);
    return vals.every(v => v !== undefined && v !== null && v !== '');
  }
  catch (e) {
    return false;
  }
}
