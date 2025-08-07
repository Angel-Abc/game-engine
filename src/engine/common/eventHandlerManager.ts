export interface IEventHandlerManager {
    addListener(cleanupFn: () => void): void
    clearListeners(): void
}

export class EventHandlerManager implements IEventHandlerManager {
    private cleanupFns: (() => void)[] = []

    public addListener(cleanupFn: () => void): void {
        this.cleanupFns.push(cleanupFn)
    }

    public clearListeners(): void {
        this.cleanupFns.forEach(fn => fn())
        this.cleanupFns = []
    }
}

