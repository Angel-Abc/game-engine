export async function loadOnce<T>(
    cache: Record<string, T>,
    key: string,
    loader: () => Promise<T>,
    setIsLoading: () => void,
    setIsRunning: () => void,
): Promise<T> {
    if (key in cache) {
        return cache[key]
    }

    setIsLoading()
    try {
        const result = await loader()
        cache[key] = result
        return result
    } finally {
        setIsRunning()
    }
}
