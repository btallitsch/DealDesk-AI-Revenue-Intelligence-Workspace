import { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  body: string
  action?: ReactNode
}

export function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <div className="empty-state__title">{title}</div>
      <div className="empty-state__body">{body}</div>
      {action}
    </div>
  )
}
