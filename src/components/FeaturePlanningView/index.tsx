import { AppStore } from '../../hooks/useAppStore'
import { BlockerSummary } from '../../types'
import { UrgencyBadge, EffortBadge, StatusBadge } from '../shared/Badge'
import { formatCurrency } from '../../utils/formatters'
import { EFFORT_POINTS } from '../../utils/calculations'
import { EmptyState } from '../shared/EmptyState'
import { BarChart3 } from 'lucide-react'

interface FeaturePlanningProps {
  store: AppStore
}

// Revenue per effort-point — the core ROI signal
function calcROI(totalRevenue: number, effort: BlockerSummary['blocker']['effort']): number {
  const ep = EFFORT_POINTS[effort]
  return Math.round(totalRevenue / ep)
}

function getPriorityClass(score: number): string {
  if (score >= 50) return 'high'
  if (score >= 20) return 'mid'
  return 'low'
}

// Map effort to a rough week label for the matrix
const EFFORT_WEEKS: Record<string, string> = {
  small: '1–2 wks',
  medium: '3–5 wks',
  large: '6+ wks',
}

// Position blockers in a 3-column (effort) × 3-row (revenue tier) matrix
function getMatrixPosition(summary: BlockerSummary): { col: number; row: number } {
  const col = { small: 0, medium: 1, large: 2 }[summary.blocker.effort] ?? 1
  const rev = summary.totalRevenue
  const row = rev >= 150_000 ? 0 : rev >= 60_000 ? 1 : 2
  return { col, row }
}

const MATRIX_ROW_LABELS = ['$150K+', '$60K–$150K', '<$60K']
const MATRIX_COL_LABELS = ['Small  (1–2 wks)', 'Medium  (3–5 wks)', 'Large  (6+ wks)']

// Quadrant recommendation
const QUADRANT_HINT: Record<string, string> = {
  '0-0': '🚀 Quick Win',
  '0-1': '✅ Do Next',
  '0-2': '📈 High Value',
  '1-0': '⚡ Fast Unlock',
  '1-1': '📋 Plan It',
  '1-2': '🔍 Evaluate',
  '2-0': '💡 Consider',
  '2-1': '⏳ Later',
  '2-2': '🚫 Deprioritize',
}

export function FeaturePlanningView({ store }: FeaturePlanningProps) {
  const { blockerSummaries } = store

  // Only show blockers with actual deals attached
  const active = blockerSummaries.filter(s => s.dealCount > 0)

  // Build matrix data structure: [row][col] = BlockerSummary[]
  const matrix: BlockerSummary[][][] = Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => [] as BlockerSummary[]),
  )
  active.forEach(s => {
    const { row, col } = getMatrixPosition(s)
    matrix[row][col].push(s)
  })

  if (active.length === 0) {
    return (
      <div className="view">
        <div className="view__header">
          <div className="view__title-block">
            <h1 className="view__title">Feature Planning</h1>
            <p className="view__subtitle">Effort vs Revenue matrix to prioritise your roadmap</p>
          </div>
        </div>
        <EmptyState
          icon={<BarChart3 size={20} />}
          title="No data yet"
          body="Add deals and link them to blockers to see the effort vs revenue matrix."
        />
      </div>
    )
  }

  return (
    <div className="view">
      <div className="view__header">
        <div className="view__title-block">
          <h1 className="view__title">Feature Planning</h1>
          <p className="view__subtitle">Effort vs Revenue matrix — find the highest ROI work</p>
        </div>
      </div>

      {/* ── Effort × Revenue Matrix ─────────────────────────────────────── */}
      <div className="matrix-wrap" style={{ marginBottom: 28 }}>
        <div className="matrix-title">Effort × Revenue Matrix</div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '72px repeat(3, 1fr)',
            gridTemplateRows: 'auto repeat(3, auto)',
            gap: 1,
            background: 'var(--border)',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
          }}
        >
          {/* Top-left corner */}
          <div
            style={{
              background: 'var(--bg-surface)',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center' }}>
              Revenue
              <br />↑ · Effort →
            </span>
          </div>

          {/* Column headers */}
          {MATRIX_COL_LABELS.map((label, ci) => (
            <div
              key={ci}
              style={{
                background: 'var(--bg-surface)',
                padding: '10px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--text-secondary)',
                textAlign: 'center',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {label}
            </div>
          ))}

          {/* Rows */}
          {matrix.map((row, ri) => (
            <>
              {/* Row header */}
              <div
                key={`rh-${ri}`}
                style={{
                  background: 'var(--bg-surface)',
                  padding: '12px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  transform: 'rotate(180deg)',
                  whiteSpace: 'nowrap',
                }}
              >
                {MATRIX_ROW_LABELS[ri]}
              </div>

              {/* Cells */}
              {row.map((cell, ci) => {
                const hint = QUADRANT_HINT[`${ci}-${ri}`] ?? ''
                const isHighValue = ri === 0 && ci === 0
                return (
                  <div
                    key={`cell-${ri}-${ci}`}
                    style={{
                      background: isHighValue
                        ? 'rgba(16,185,129,0.07)'
                        : 'var(--bg-card)',
                      padding: '12px 14px',
                      minHeight: 90,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: 'var(--text-muted)',
                        marginBottom: 6,
                        fontWeight: 600,
                      }}
                    >
                      {hint}
                    </div>
                    {cell.length === 0 ? (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>—</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {cell.map(s => (
                          <div
                            key={s.blocker.id}
                            style={{
                              background: 'var(--bg-surface)',
                              border: '1px solid var(--border)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '6px 9px',
                            }}
                          >
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                marginBottom: 3,
                              }}
                            >
                              {s.blocker.title}
                            </div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <span
                                style={{
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: 11,
                                  color: 'var(--green)',
                                  fontWeight: 700,
                                }}
                              >
                                {formatCurrency(s.totalRevenue)}
                              </span>
                              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                {s.dealCount} deal{s.dealCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </>
          ))}
        </div>
      </div>

      {/* ── Ranked ROI Table ────────────────────────────────────────────── */}
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        Ranked by ROI — Revenue per Story Point
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 36 }}>#</th>
              <th>Feature / Blocker</th>
              <th>Revenue at Stake</th>
              <th>Deals</th>
              <th>Effort</th>
              <th>Urgency</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>ROI Score</th>
              <th style={{ textAlign: 'right' }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {active.map((s, i) => {
              const roi = calcROI(s.totalRevenue, s.blocker.effort)
              const pClass = getPriorityClass(s.priorityScore)
              return (
                <tr key={s.blocker.id}>
                  <td
                    style={{
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                    }}
                  >
                    {i + 1}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{s.blocker.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {s.blocker.description.slice(0, 80)}
                      {s.blocker.description.length > 80 ? '…' : ''}
                    </div>
                    <div className="tags" style={{ marginTop: 4 }}>
                      {s.blocker.tags.map(t => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="mono green">{formatCurrency(s.totalRevenue)}</td>
                  <td className="mono">{s.dealCount}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <EffortBadge effort={s.blocker.effort} />
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {EFFORT_WEEKS[s.blocker.effort]}
                      </span>
                    </div>
                  </td>
                  <td><UrgencyBadge urgency={s.blocker.urgency} /></td>
                  <td><StatusBadge status={s.blocker.status} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'var(--blue)',
                      }}
                    >
                      {formatCurrency(roi)}/pt
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={`priority-score ${pClass}`}>#{s.priorityScore}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── Legend ─────────────────────────────────────────────────────── */}
      <div
        style={{
          marginTop: 20,
          padding: '14px 18px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Priority Score Formula:
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
          (Revenue / 1K) × urgency_weight × log₂(deals + 2) ÷ effort_points
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          ROI Score = Revenue ÷ Effort Points
        </div>
      </div>
    </div>
  )
}
