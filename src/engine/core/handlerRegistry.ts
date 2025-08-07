import { fatalError } from '@utils/logMessage'
import type { IMessageBus } from '@utils/messageBus'
import type { IGameLoader, IHandlerLoader } from '@loader/loader'
import type { Handler } from '@loader/data/handler'
import type { IActionHandler } from '../actions/actionHandler'
import type { IConditionResolver } from '../conditions/conditionResolver'
import type { Action } from '@loader/data/action'
import type { Condition } from '@loader/data/condition'
import type { CleanUp } from '@utils/types'
import type { IGameEngine } from './gameEngine'

export interface IHandlerRegistry {
    registerActionHandler(handler: IActionHandler): void
    registerConditionResolver(resolver: IConditionResolver): void
    executeAction(engine: IGameEngine, action: Action): void
    resolveCondition(engine: IGameEngine, condition: Condition | null): boolean
    registerGameHandlers(engine: IGameEngine, loader: IGameLoader & IHandlerLoader, messageBus: IMessageBus): Promise<void>
    cleanup(): void
}

export class HandlerRegistry implements IHandlerRegistry {
    private actionHandlers = new Map<string, IActionHandler>()
    private conditionResolvers = new Map<string, IConditionResolver>()
    private handlerCleanupList: CleanUp[] = []

    public registerActionHandler(handler: IActionHandler): void {
        this.actionHandlers.set(handler.type, handler)
    }

    public registerConditionResolver(resolver: IConditionResolver): void {
        this.conditionResolvers.set(resolver.type, resolver)
    }

    public executeAction(engine: IGameEngine, action: Action): void {
        const handler = this.actionHandlers.get(action.type)
        if (handler === undefined) {
            fatalError('HandlerRegistry', `No action handler for type: ${action.type}`)
        }
        handler.handle(engine, action)
    }

    public resolveCondition(engine: IGameEngine, condition: Condition | null): boolean {
        if (condition === null) return true
        const resolver = this.conditionResolvers.get(condition.type)
        if (resolver === undefined) {
            fatalError('HandlerRegistry', `No condition resolver for type: ${condition.type}`)
        }
        return resolver.resolve(engine, condition)
    }

    public async registerGameHandlers(engine: IGameEngine, loader: IGameLoader & IHandlerLoader, messageBus: IMessageBus): Promise<void> {
        this.cleanup()
        const handlerFiles = loader.Game.handlers
        for (const path of handlerFiles) {
            const handlers = await loader.loadHandlers(path)
            handlers.forEach((handler: Handler) => {
                const cleanup = messageBus.registerMessageListener(
                    handler.message,
                    () => this.executeAction(engine, handler.action)
                )
                this.handlerCleanupList.push(cleanup)
            })
        }
    }

    public cleanup(): void {
        this.handlerCleanupList.forEach(c => c())
        this.handlerCleanupList = []
    }
}
