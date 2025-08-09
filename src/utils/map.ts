export function hasMapChanged<K, V>(
  prev: Map<K, V>,
  next: Map<K, V>,
  equals: (a: V, b: V) => boolean
): boolean {
  if (prev.size !== next.size)
    return true

  for (const [key, prevVal] of prev) {
    if (!next.has(key))
      return true

    const nextVal = next.get(key)!
    if (!equals(prevVal, nextVal))
      return true
  }

  return false
}

export function updateMap<K, V>(
  target: Map<K, V>,
  source: Map<K, V>,
  cloneValue: (value: V) => V
) {
  target.clear()
  for (const [key, value] of source)
    target.set(key, cloneValue(value))
}