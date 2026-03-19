import { useState } from 'react'
import { ChevronDown, ChevronUp, Pencil, Trash2, AlertTriangle, DollarSign } from 'lucide-react'
import { BlockerSummary } from '../../types'
import { UrgencyBadge, EffortBadge, StatusBadge } from '../shared/Badge'
import { StageBadge } from '../shared/Badge'
import { formatCurrency } from '../../utils/formatters'

interface BlockerCardProps {
  summary: BlockerSummary
  rank: number
  onEdit: () => void
  onDelete: () => void
}

function getPriorityClass(score: number) {
  if (score >= 50) return 'high'
  if (score >= 20) return 'mid'
  return 'low'
}

export function BlockerCard({ summary, rank, onEdit, onDelete }: BlockerCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { blocker, deals, totalRevenue, dealCount, priorityScore } = summary
  const cls = getPriorityClass(priorityScore)

  return (
    <div className={`blocker-card ${expanded ? 'expanded' : ''}`}>
      {/* Header row — always visible */}
      <div className="blocker-card__header" onClick={() => setExpanded(v => !v)}>
        {/* Rank + icon */}
        <div
          className={`blocker-card__icon ${blocker.urgency}`}
          style={{ position: 'relative' }}
        >
          <AlertTriangle size={16} />
          <span
            style={{
              position: 'absolute',
              top: -6,
              right: -6,
              background: 'var(--bg-root)',
              border: '1px solid var(--border)',
              borderRadius: 99,
              fontSize: 9,
              fontWeight: 700,
              padding: '1px 4px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
            }}
          >
            #{rank}
          </span>
        </div>

        {/* Info */}
        <div className="blocker-card__info">
          <div className="blocker-card__title">{blocker.title}</div>
          <div className="blocker-card__stats">
            <span className="blocker-card__stat">
              <DollarSign size={11} />
              {dealCount} deal{dealCount !== 1 ? 's' : ''} at risk
            </span>
            <UrgencyBadge urgency={blocker.urgency} />
            <EffortBadge effort={blocker.effort} />
            <StatusBadge status={blocker.status} />
          </div>
          {blocker.tags.length > 0 && (
            <div className="tags" style={{ marginTop: 6 }}>
              {blocker.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="blocker-card__right">
          <div className="blocker-card__revenue">{formatCurrency(totalRevenue)}</div>
          <span className={`priority-score ${cls}`} style={{ fontSize: 12 }}>
            Score #{priorityScore}
          </span>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <button
              className="btn btn-ghost btn-icon"
              onClick={e => { e.stopPropagation(); onEdit() }}
              title="Edit blocker"
            >
              <Pencil size={13} />
            </button>
            <button
              className="btn btn-danger btn-icon"
              onClick={e => { e.stopPropagation(); onDelete() }}
              title="Delete blocker"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Chevron */}
        <div style={{ color: 'var(--text-muted)', marginLeft: 4, flexShrink: 0, alignSelf: 'center' }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Expanded — deal drilldown */}
      {expanded && (
        <div className="blocker-card__deals-expanded">
          {blocker.description && (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, padding: '12px 0 4px' }}>
              {blocker.description}
            </p>
          )}

          <div className="blocker-card__deals-expanded-title">
            Deals at Risk ({dealCount})
          </div>

          {deals.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', padding: '8px 0' }}>
              No active deals linked to this blocker yet.
            </p>
          ) : (
            deals.map(deal => (
              <div key={deal.id} className="deal-mini">
                <div className="deal-mini__left">
                  <div className="deal-mini__company">{deal.companyName}</div>
                  <div className="deal-mini__contact">{deal.contactName}</div>
                </div>
                <div className="deal-mini__right">
                  <StageBadge stage={deal.stage} />
                  <span className="deal-mini__value">{formatCurrency(deal.dealValue)}</span>
                </div>
              </div>
            ))
          )}

          {/* Revenue summary bar */}
          {deals.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingTop: 10,
                borderTop: '1px solid var(--border)',
                marginTop: 6,
                gap: 8,
                fontSize: 12,
                color: 'var(--text-secondary)',
              }}
            >
              Total at risk:
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: 14,
                  color: 'var(--green)',
                }}
              >
                {formatCurrency(totalRevenue)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
