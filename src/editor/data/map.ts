export interface MapData {
  width?: number
  height?: number
}

export type Maps = Record<string, MapData>

export function isMapData(value: unknown): value is MapData {
  return (
    typeof value === 'object' &&
    value !== null &&
    ('width' in (value as Record<string, unknown>) ||
      'height' in (value as Record<string, unknown>))
  )
}
