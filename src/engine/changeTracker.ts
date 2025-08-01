import { setValueAtPath } from '@utils/objectPath'

export type Primitive = string | number | boolean | null | Record<string, unknown> | unknown[]

export type ChangeInfo = {
    path: string,
    oldValue: Primitive,
    newValue: Primitive
}

export interface SaveData {
    turns: TurnChanges[]
    activeTurnIndex: number
    consolidatedChanges: { [key: string]: Primitive }
}

export type TurnChanges = {
    changes: ChangeInfo[]
}

export interface IChangeTracker<TData extends Record<string, unknown>> {
    trackChange(changeInfo: ChangeInfo): void
    startNewTurn(): void
    undo(dataSet: TData): void
    save(): SaveData
    load(initialData: TData, saveData: SaveData): void
}

export interface IChangeTrackerDebugger {
    changes: TurnChanges[]
    activeTurnIndex: number
    consolidatedChanges: Map<string, Primitive>
}

export class ChangeTracker<TData extends Record<string, unknown>> implements IChangeTracker<TData>, IChangeTrackerDebugger {
    changes: TurnChanges[] = []
    activeTurnIndex = -1
    consolidatedChanges: Map<string, Primitive> = new Map<string, Primitive>()
    maxNumberOfTurnsToTrack: number

    constructor(maxNumberOfTurnsToTrack: number = 10) {
        this.maxNumberOfTurnsToTrack = maxNumberOfTurnsToTrack
        this.startNewTurn()
    }

    trackChange(changeInfo: ChangeInfo): void {
        this.changes[this.activeTurnIndex].changes.push(changeInfo)
    }

    startNewTurn(): void {
        this.activeTurnIndex++
        this.changes[this.activeTurnIndex] = { changes: [] }
        if (this.changes.length > this.maxNumberOfTurnsToTrack) {
            this.addToConsolidatedChanges(this.changes.shift() as TurnChanges)
            this.activeTurnIndex--
        }
    }

    undo(dataSet: TData): void {
        if (this.activeTurnIndex >= 0) {
            this.rollbackChanges(dataSet, this.changes[this.activeTurnIndex].changes)
            this.activeTurnIndex--
        }
    }

    private rollbackChanges(dataSet: TData, changes: ChangeInfo[]) {
        for (const change of changes) {
            setValueAtPath(dataSet as unknown as Record<string, unknown>, change.path, change.oldValue)
        }
    }

    public save(): SaveData {
        return {
            turns: this.changes,
            activeTurnIndex: this.activeTurnIndex,
            consolidatedChanges: Object.fromEntries(this.consolidatedChanges)
        }
    }

    public load(initialData: TData, saveData: SaveData): void {
        this.changes = saveData.turns
        this.activeTurnIndex = saveData.activeTurnIndex
        this.consolidatedChanges = new Map<string, Primitive>(Object.entries(saveData.consolidatedChanges))

        this.applyConsolidatedChanges(initialData, this.consolidatedChanges)
        for (let i = 0; i <= this.activeTurnIndex; i++) {
            this.applyChanges(initialData, this.changes[i].changes)
        }
    }

    private applyChanges(dataSet: TData, changes: ChangeInfo[]) {
        for (const change of changes) {
            setValueAtPath(dataSet as unknown as Record<string, unknown>, change.path, change.newValue)
        }
    }

    private applyConsolidatedChanges(dataSet: TData, consolidatedChanges: Map<string, Primitive>): void {
        for (const [path, value] of consolidatedChanges) {
            setValueAtPath(dataSet as unknown as Record<string, unknown>, path, value)
        }
    }

    private addToConsolidatedChanges(turnChanges: TurnChanges): void {
        for (const change of turnChanges.changes) {
            this.consolidatedChanges.set(change.path, change.newValue)
        }
    }
}
