export interface KeyboardEventTarget {
    addEventListener(type: 'keydown', listener: (event: KeyboardEvent) => void): void
    removeEventListener(type: 'keydown', listener: (event: KeyboardEvent) => void): void
}

export class DocumentKeyboardEventTarget implements KeyboardEventTarget {
    public addEventListener(type: 'keydown', listener: (event: KeyboardEvent) => void): void {
        document.addEventListener(type, listener)
    }

    public removeEventListener(type: 'keydown', listener: (event: KeyboardEvent) => void): void {
        document.removeEventListener(type, listener)
    }
}

export class TestKeyboardEventTarget implements KeyboardEventTarget {
    private listeners: Map<string, Set<(event: KeyboardEvent) => void>> = new Map()

    public addEventListener(type: 'keydown', listener: (event: KeyboardEvent) => void): void {
        let typeListeners = this.listeners.get(type)
        if (!typeListeners) {
            typeListeners = new Set()
            this.listeners.set(type, typeListeners)
        }
        typeListeners.add(listener)
    }

    public removeEventListener(type: 'keydown', listener: (event: KeyboardEvent) => void): void {
        this.listeners.get(type)?.delete(listener)
    }

    public dispatch(event: KeyboardEvent & { type: 'keydown' }): void {
        this.listeners.get(event.type)?.forEach(listener => listener(event))
    }

    public listenerCount(type: 'keydown'): number {
        return this.listeners.get(type)?.size ?? 0
    }
}
