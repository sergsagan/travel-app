export function toDateTimeLocal(ts?: number) {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toLocaleString('sv-SE').slice(0, 16);
}

export function fromDateTimeLocal(value: string) {
    return new Date(value).getTime();
}
