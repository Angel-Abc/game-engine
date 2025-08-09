import { logDebug } from './logMessage'
import { type CleanUp } from './types'

export type TrackValueSubscriber = () => void
export type OnValueChangedCallback<T> = (newValue: T, oldValue: T) => void

export interface ITrackedValue<T> {
    get value():T
    set value(newValue: T)
    subscribe(callback: TrackValueSubscriber): CleanUp
}

export class TrackedValue<T> {
    private _value: T
    private _name: string
    private _callback?: OnValueChangedCallback<T>
    private subscribers: Set<TrackValueSubscriber> = new Set<TrackValueSubscriber>()

    constructor(name: string, value: T, callback?: OnValueChangedCallback<T>) {
        this._value = value
        this._name = name
        this._callback = callback
    }

    subscribe(callback: TrackValueSubscriber): CleanUp {
        this.subscribers.add(callback)
        return () => {
            this.subscribers.delete(callback)
        }
    }

    get value(): T {
        return this._value
    }

    set value(newValue: T) {
        if (this._value !== newValue) {
            const oldValue = this._value
            this._value = newValue
            logDebug('TrackedState', 'TrackedValue {0} changed from {2} to {1}', this._name, newValue, oldValue)
            this.subscribers.forEach(subscriber => subscriber())
            if (this._callback) {
                this._callback(newValue, oldValue)
            }
        }
    }
}
