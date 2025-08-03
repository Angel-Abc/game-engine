import { useCallback } from 'react'

export interface EditableMapActions<T = string> {
  updateId: (oldId: string, newId: string) => void
  updateItem: (id: string, value: T) => void
  addItem: () => void
  removeItem: (id: string) => void
}

export interface EditableArrayActions {
  updateItem: (index: number, value: string) => void
  addItem: () => void
  removeItem: (index: number) => void
}

export function useEditableList<V>(
  setValue: React.Dispatch<React.SetStateAction<Record<string, V>>>,
  options: { type: 'map'; prefix: string; empty: V }
): EditableMapActions<V>
export function useEditableList(
  setValue: React.Dispatch<React.SetStateAction<string[]>>,
  options: { type: 'array' }
): EditableArrayActions
export function useEditableList<V>(
  setValue:
    | React.Dispatch<React.SetStateAction<Record<string, V>>>
    | React.Dispatch<React.SetStateAction<string[]>>,
  options: { type: 'map'; prefix: string; empty: V } | { type: 'array' },
): EditableMapActions<V> | EditableArrayActions {
  if (options.type === 'map') {
    const dispatch = setValue as React.Dispatch<
      React.SetStateAction<Record<string, V>>
    >
    const updateId = useCallback(
      (oldId: string, newId: string) => {
        dispatch((curr) => {
          const map = { ...curr }
          const value = map[oldId]
          delete map[oldId]
          map[newId] = value
          return map
        })
      },
      [dispatch]
    )

    const updateItem = useCallback(
      (id: string, value: V) => {
        dispatch((curr) => ({ ...curr, [id]: value }))
      },
      [dispatch]
    )

    const addItem = useCallback(() => {
      dispatch((curr) => {
        const map = { ...curr }
        let newId = `new-${options.prefix}-1`
        let i = 2
        while (Object.prototype.hasOwnProperty.call(map, newId)) {
          newId = `new-${options.prefix}-${i}`
          i += 1
        }
        map[newId] = options.empty
        return map
      })
    }, [dispatch, options.prefix, options.empty])

    const removeItem = useCallback(
      (id: string) => {
        dispatch((curr) => {
          const map = { ...curr }
          delete map[id]
          return map
        })
      },
      [dispatch]
    )

    return { updateId, updateItem, addItem, removeItem }
  }

  const dispatch = setValue as React.Dispatch<React.SetStateAction<string[]>>

  const updateItem = useCallback(
    (index: number, value: string) => {
      dispatch((curr) => {
        const arr = [...curr]
        arr[index] = value
        return arr
      })
    },
    [dispatch]
  )

  const addItem = useCallback(() => {
    dispatch((curr) => [...curr, ''])
  }, [dispatch])

  const removeItem = useCallback(
    (index: number) => {
      dispatch((curr) => curr.filter((_, i) => i !== index))
    },
    [dispatch]
  )

  return { updateItem, addItem, removeItem }
}

