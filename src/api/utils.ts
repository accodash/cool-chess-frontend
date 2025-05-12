export function toSearchParams(obj: Record<string, string | number>) {
    return new URLSearchParams(Object.fromEntries(Object.entries(obj).map(([key, val]) => [key, String(val)])));
}
