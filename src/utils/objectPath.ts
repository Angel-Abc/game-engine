export function setValueAtPath(
    obj: Record<string, unknown>,
    path: string,
    value: unknown,
): void {
    const parts = path.split('.');
    let current: Record<string, unknown> = obj;

    for (let i = 0; i < parts.length - 1; i++) {
        const next = current[parts[i]];
        if (typeof next === 'object' && next !== null) {
            current = next as Record<string, unknown>;
        } else {
            // Abort if an intermediate segment does not exist
            return;
        }
    }

    const last = parts[parts.length - 1];
    if (Object.prototype.hasOwnProperty.call(current, last)) {
        current[last] = value;
    }
}
