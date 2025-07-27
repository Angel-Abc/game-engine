import { fatalError } from '@utils/logMessage'
import type { IChangeTracker, Primitive, SaveData } from './changeTracker'

export interface IStateManager<TData extends Record<string, unknown>> {
    rollbackTurn(): void
    commitTurn(): void
    save(): string 
    load(saveString: string): void   
    get state(): TData
}

export class StateManager<TData extends Record<string, unknown>> implements IStateManager<TData> {
    private proxyObjectCache = new WeakMap<object, unknown>()
    private stateProxy: TData
    private underlyingData: TData
    private initialData: TData
    private changeTracker: IChangeTracker<TData>

    constructor(initialData: TData, changeTracker: IChangeTracker<TData>) {
        this.initialData = initialData
        this.changeTracker = changeTracker
        this.underlyingData = { ...initialData }
        this.stateProxy = this.createStateProxy(this.underlyingData) as TData
    }

    get state(): TData {
        return this.stateProxy
    }

    public commitTurn(): void {
        this.changeTracker.startNewTurn()
    }

    public rollbackTurn(): void {
        this.changeTracker.undo(this.underlyingData)
    }

    public save(): string {
        const saveData = this.changeTracker.save()
        const result = JSON.stringify(saveData)
        return result
    }

    public load(saveString: string): void {
        const saveData = JSON.parse(saveString) as SaveData
        this.underlyingData = structuredClone(this.initialData)
        this.stateProxy = this.createStateProxy(this.underlyingData) as TData
        this.changeTracker.load(this.underlyingData, saveData)
    }

    private createStateProxy(target: Record<string, unknown>, path: string | null = null): Record<string, unknown> {
        // non-object types don’t need a proxy
        if (target === null || typeof target !== 'object') {
            return target
        }

        // already cached? return the cached version
        if (this.proxyObjectCache.has(target)) {
            return this.proxyObjectCache.get(target) as Record<string, unknown>
        }

        // create the result proxy
        const proxy = new Proxy(target, {
            get: (targetObj: Record<string, unknown>, prop: string | symbol, receiver: unknown) => {
                let value: unknown = Reflect.get(targetObj, prop, receiver as object)

                const currentPath = path ? `${path}.${String(prop)}` : String(prop)

                if (value !== null && typeof value === 'function') {
                    const isArrayMethod =
                        Array.isArray(targetObj) &&
                        typeof prop === 'string' &&
                        typeof Array.prototype[prop as keyof typeof Array.prototype] === 'function'

                    if (isArrayMethod) {
                        return value.bind(targetObj) as unknown
                    } fatalError('State proxy cannot contain functions. Please use a different approach for {0}', currentPath)
                } else if (value !== null && typeof value === 'object') {
                    // create a proxy for the object
                    value = this.createStateProxy(value as Record<string, unknown>, currentPath)
                }

                return value
            },
            set: (targetObj: Record<string, unknown>, prop: string | symbol, value: unknown, receiver: unknown) => {
                const currentPath = path ? `${path}.${String(prop)}` : String(prop)

                // if the value is an object, create a proxy for it
                if (value !== null && typeof value === 'object') {
                    value = this.createStateProxy(value as Record<string, unknown>, currentPath)
                    const result = Reflect.set(targetObj, prop, value, receiver as object)
                    return result
                }
                const oldValue: unknown = Reflect.get(targetObj, prop, receiver as object)
                const result = Reflect.set(targetObj, prop, value, receiver as object)
                if (oldValue === null || oldValue === undefined || typeof oldValue === 'string' || typeof oldValue === 'number' || typeof oldValue === 'boolean') {
                    this.changeTracker.trackChange({ path: currentPath, newValue: value as Primitive, oldValue: (oldValue ?? null) as Primitive })
                }
                return result
            }

        })

        this.proxyObjectCache.set(target, proxy)
        return proxy
    }
}
