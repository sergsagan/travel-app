export function formatNumber(value?: number | null, digits = 5) {
    if (typeof value !== 'number') return ''
    return value.toFixed(digits)
}
