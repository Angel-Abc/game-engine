export type InitialData = {
    language: string
}

export type Game = {
    title: string
    description: string
    version: string
    initialData: InitialData
    languages: Record<string, string>
}
