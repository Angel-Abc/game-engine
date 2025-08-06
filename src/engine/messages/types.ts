export interface SwitchMapPayload {
    mapName: string
    position?: {
        x: number
        y: number
    }
}

export interface ChangePositionPayload {
    x: number
    y: number
}