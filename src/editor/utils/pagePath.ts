export const pagePath = (id: string): string => `pages/${id}.json`

const PAGE_ID_PATTERN = /^[A-Za-z0-9_-]+$/

export const isValidPageId = (id: string): boolean => PAGE_ID_PATTERN.test(id)

export const generatePageId = (
  baseName: string,
  timestamp: () => number = Date.now,
): string => `${baseName}-${timestamp()}`
