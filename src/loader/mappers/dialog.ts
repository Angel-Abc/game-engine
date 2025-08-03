import type { Dialog as DialogData, DialogSet as DialogSetData, Behavior as BehaviorData } from '@loader/data/dialog'
import { type Dialog, type DialogSet, type Behavior } from '@loader/schema/dialog'

export function mapDialogSet(dialogs: DialogSet): DialogSetData {
    const defaultBehavior = mapBehavior(dialogs['default-behavior'])
    return {
        id: dialogs.id,
        dialogs: dialogs.dialogs.map(dialog => mapDialog(dialog, defaultBehavior))
    }
}

export function mapBehavior(behavior: Behavior): BehaviorData {
    return {
        canMove: behavior['can-move']
    }
}

export function mapDialog(dialog: Dialog, defaultBehavior: BehaviorData): DialogData {
    const behavior = dialog.behavior ?? {}
    return {
        id: dialog.id,
        message: dialog.message,
        behavior: {
            ...defaultBehavior,
            ...behavior
        }
    }
}