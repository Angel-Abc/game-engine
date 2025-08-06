import type { IChangeTracker, Primitive } from './changeTracker'

export const getCachedProxy = <T extends Record<string, unknown>>(cache: WeakMap<object, unknown>, target: T): T | undefined => {
    return cache.get(target) as T | undefined
}

export const cacheProxy = <T extends Record<string, unknown>>(cache: WeakMap<object, unknown>, target: T, proxy: T): void => {
    cache.set(target, proxy)
}

export const buildPath = (path: string | null, prop: string | symbol): string => {
    return path ? `${path}.${String(prop)}` : String(prop)
}

export const trackChange = <TData extends Record<string, unknown>>(changeTracker: IChangeTracker<TData>, path: string, newValue: unknown, oldValue: unknown): void => {
    if (newValue !== null && typeof newValue === 'object') {
        const oldClone = oldValue === undefined ? null : JSON.parse(JSON.stringify(oldValue))
        const newClone = JSON.parse(JSON.stringify(newValue))
        changeTracker.trackChange({ path, newValue: newClone as Primitive, oldValue: oldClone as Primitive })
    } else if (
        oldValue === null ||
        oldValue === undefined ||
        typeof oldValue === 'string' ||
        typeof oldValue === 'number' ||
        typeof oldValue === 'boolean'
    ) {
        changeTracker.trackChange({ path, newValue: newValue as Primitive, oldValue: (oldValue ?? null) as Primitive })
    }
}
