export function setValueAtPath(obj: Record<string, unknown>, path: string, value: unknown): void {
    const parts = path.split('.');
    let current: Record<string, unknown> = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        const next = current[parts[i]];
        if (typeof next === 'object' && next !== null) {
            current = next as Record<string, unknown>;
        }
    }
    const last = parts[parts.length - 1];
    current[last] = value;
}
