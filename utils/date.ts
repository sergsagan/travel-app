export function toDateTimeLocal(ts?: number) {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toISOString().slice(0, 10);
}

export function fromDateTimeLocal(value: string) {
    const parts = value.split('-').map(p => parseInt(p, 10));
    if (parts.length !== 3 || parts.some(isNaN)) return 0;
    const [y, m, d] = parts as [number, number, number];
    return new Date(y, m - 1, d).getTime();
}
