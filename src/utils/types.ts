export type CleanUp = () => void

export type Message = {
    message: string
    payload: null | number | string | Record<string, unknown>
}
