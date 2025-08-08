export interface Page {
  title?: string
  description?: string
}

export type Pages = Record<string, Page>

export function isPage(value: unknown): value is Page {
  return (
    typeof value === 'object' &&
    value !== null &&
    ('title' in (value as Record<string, unknown>) ||
      'description' in (value as Record<string, unknown>))
  )
}
