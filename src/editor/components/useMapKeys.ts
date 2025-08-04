import { useRef } from 'react'

/**
 * Maintain stable React keys for editable maps.
 *
 * @param ids Current item identifiers
 * @returns helpers to get keys and update mapping when ids change
 */
export function useMapKeys(ids: string[]) {
  const keyMap = useRef(new Map<string, number>())
  const nextKey = useRef(0)

  ids.forEach((id) => {
    if (!keyMap.current.has(id)) {
      keyMap.current.set(id, nextKey.current++)
    }
  })

  const getKey = (id: string) => {
    let key = keyMap.current.get(id)
    if (key === undefined) {
      key = nextKey.current++
      keyMap.current.set(id, key)
    }
    return key
  }

  const updateId = (oldId: string, newId: string) => {
    const key = keyMap.current.get(oldId)
    if (key !== undefined) {
      keyMap.current.set(newId, key)
      keyMap.current.delete(oldId)
    }
  }

  const removeId = (id: string) => {
    keyMap.current.delete(id)
  }

  return { getKey, updateId, removeId }
}

