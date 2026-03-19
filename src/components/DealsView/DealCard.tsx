import { useState } from 'react'
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Deal, Blocker } from '../../types'
import { StageBadge, UrgencyBadge } from '../shared/Badge'
import { formatCurrency, formatRelativeDate } from '../../utils/formatters'

interface DealCardProps {
  deal: Deal
  blockers: Blocker[]
  onEdit: () => void
  onDelete: () => void
}

export function DealCard({ deal, blockers, onEdit, onDelete }: DealCardProps) {
  const [expanded, setExpanded] = useState(false)
  const linkedBlockers = blockers.filter(b => deal.blockerIds.includes(b.id))

  return (
    <div className="card">
      <div className="card__header">
        <div>
          <div className="card__title">{deal.companyName}</div>
          <div className="card__meta">
            <StageBadge stage={deal.stage} />
            {linkedBlockers.length > 0 && (
              <span className="badge badge-amber">
                {linkedBlockers.length} blocker{linkedBlockers.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--green)',
            flexShrink: 0,
          }}
        >
          {formatCurrency(deal.dealValue)}
        </div>
      </div>

      <div className="card__body">
        {deal.contactName && (
          <div style={{ marginBottom: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
            Contact: <strong style={{ color: 'var(--text-primary)' }}>{deal.contactName}</strong>
          </div>
        )}
        {deal.notes && (
          <div
            style={{
              fontSize: 12.5,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: expanded ? 'unset' : 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {deal.notes}
          </div>
        )}
      </div>

      {linkedBlockers.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setExpanded(v => !v)}
            style={{ width: '100%', justifyContent: 'center', gap: 6 }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Hide' : 'Show'} linked blockers
          </button>
          {expanded && (
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {linkedBlockers.map(b => (
                <div
                  key={b.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
                    {b.title}
                  </span>
                  <UrgencyBadge urgency={b.urgency} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="card__footer">
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Updated {formatRelativeDate(deal.updatedAt)}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-ghost btn-icon" onClick={onEdit} title="Edit deal">
            <Pencil size={14} />
          </button>
          <button className="btn btn-danger btn-icon" onClick={onDelete} title="Delete deal">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
