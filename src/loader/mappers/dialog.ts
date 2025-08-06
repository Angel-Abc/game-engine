import type { Dialog as DialogData, DialogSet as DialogSetData, Behavior as BehaviorData } from '@loader/data/dialog'
import { type Dialog, type DialogSet, type Behavior } from '@loader/schema/dialog'
import { mapCondition } from './condition'

export function mapDialogSet(dialogSet: DialogSet): DialogSetData {
    const defaultBehavior = mapBehavior(dialogSet['default-behavior'])
    const dialogs: Record<string, DialogData> = {}
    dialogSet.dialogs.forEach(dialog => dialogs[dialog.id] = mapDialog(dialog, defaultBehavior))
    return {
        id: dialogSet.id,
        startCondition: mapCondition(dialogSet['start-condition']),
        dialogs: dialogs,
        startWith: dialogSet['start-with']
    }
}

export function mapBehavior(behavior: Behavior): BehaviorData {
    return {
        canMove: behavior['can-move']
    }
}

export function mapDialog(dialog: Dialog, defaultBehavior: BehaviorData): DialogData {
    const behavior = dialog.behavior ? mapBehavior(dialog.behavior) : {}
    return {
        id: dialog.id,
        message: dialog.message,
        behavior: {
            ...defaultBehavior,
            ...behavior
        }
    }
}