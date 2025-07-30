export interface PostMessageAction {
    type: 'post-message'
    message: string
    payload: number | string | Record<string, unknown>
}

export type Action = PostMessageAction
