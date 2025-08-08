import { fatalError } from '@utils/logMessage'
import type { IMessageBus } from '@utils/messageBus'
import type { IGameLoader, IHandlerLoader } from '@loader/loader'
import type { Handler } from '@loader/data/handler'
import type { IActionHandler } from '../actions/actionHandler'
import type { IConditionResolver } from '../conditions/conditionResolver'
import type { Condition } from '@loader/data/condition'
import type { CleanUp, Message } from '@utils/types'
import type { IGameEngine } from './gameEngine'
import type { BaseAction } from '@loader/data/action'

export interface IHandlerRegistry {
    registerActionHandler<T extends BaseAction>(handler: IActionHandler<T>): void
    registerConditionResolver(resolver: IConditionResolver): void
    executeAction<T extends BaseAction>(engine: IGameEngine, action: T, message?: Message): void
    resolveCondition(engine: IGameEngine, condition: Condition | null): boolean
    registerGameHandlers(engine: IGameEngine, gameLoader: IGameLoader, handlerLoader: IHandlerLoader, messageBus: IMessageBus): Promise<void>
    cleanup(): void
}

export class HandlerRegistry implements IHandlerRegistry {
    private actionHandlers = new Map<string, IActionHandler<BaseAction>>()
    private conditionResolvers = new Map<string, IConditionResolver>()
    private handlerCleanupList: CleanUp[] = []

    public registerActionHandler<T extends BaseAction>(handler: IActionHandler<T>): void {
        this.actionHandlers.set(handler.type, handler as IActionHandler<BaseAction>)
    }

    public registerConditionResolver(resolver: IConditionResolver): void {
        this.conditionResolvers.set(resolver.type, resolver)
    }

    public executeAction<T extends BaseAction>(engine: IGameEngine, action: T, message?: Message): void {
        const handler = this.actionHandlers.get(action.type) as IActionHandler<T> | undefined
        if (handler === undefined) {
            fatalError('HandlerRegistry', `No action handler for type: ${action.type}`)
        }
        handler.handle(engine, action, message)
    }

    public resolveCondition(engine: IGameEngine, condition: Condition | null): boolean {
        if (condition === null) return true
        const resolver = this.conditionResolvers.get(condition.type)
        if (resolver === undefined) {
            fatalError('HandlerRegistry', `No condition resolver for type: ${condition.type}`)
        }
        return resolver.resolve(engine, condition)
    }

    public async registerGameHandlers(engine: IGameEngine, gameLoader: IGameLoader, handlerLoader: IHandlerLoader, messageBus: IMessageBus): Promise<void> {
        this.cleanup()
        const handlerFiles = gameLoader.Game.handlers
        for (const path of handlerFiles) {
            const handlers = await handlerLoader.loadHandlers(path)
            handlers.forEach((handler: Handler) => {
                const cleanup = messageBus.registerMessageListener(
                    handler.message,
                    (msg) => this.executeAction(engine, handler.action, msg)
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
