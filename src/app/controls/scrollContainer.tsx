import { logDebug } from '@utils/logMessage'
import { useRef, useLayoutEffect, type ReactNode } from 'react'

type ScrollContainerProps = {
  children?: ReactNode
  className?: string
  html?: string
}

export const ScrollContainer: React.FC<ScrollContainerProps> = ({ children, className, html }): React.JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const isAtBottom =
      el.scrollHeight - el.scrollTop <= el.clientHeight * 1.1
    logDebug('scrollHeight: {0}, scrollTop: {1}, clientHeight: {2}, isAtBottom: {3}', el.scrollHeight, el.scrollTop, el.clientHeight, isAtBottom)

    if (isAtBottom) {
      el.scrollTop = el.scrollHeight
    }

  }, [children, html]) 

  if (html) {
    return (
      <div
        ref={ref}
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={className}
    >
      {children}
    </div>
  )
}
