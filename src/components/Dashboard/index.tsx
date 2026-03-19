import { TrendingUp, AlertTriangle } from 'lucide-react'
import { AppStore } from '../../hooks/useAppStore'
import { StatCard } from '../shared/StatCard'
import { UrgencyBadge, EffortBadge, StageBadge } from '../shared/Badge'
import { formatCurrency, formatRelativeDate } from '../../utils/formatters'


interface DashboardProps {
  store: AppStore
  onNavigate: (view: 'deals' | 'blockers' | 'planning') => void
}

function getPriorityClass(score: number): string {
  if (score >= 50) return 'high'
  if (score >= 20) return 'mid'
  return 'low'
}

export function Dashboard({ store, onNavigate }: DashboardProps) {
  const { blockerSummaries, totalPipelineAtRisk, deals, blockers, activeDeals } = store

  const totalDeals = deals.length
  const openBlockers = blockers.filter(b => b.status === 'open').length
  const topBlockers = blockerSummaries.slice(0, 5)
  const recentDeals = [...deals]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  return (
    <div className="view">
      <div className="view__header">
        <div className="view__title-block">
          <h1 className="view__title">Revenue Intelligence</h1>
          <p className="view__subtitle">What should you build right now to close more deals?</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        <StatCard
          label="Active Pipeline at Risk"
          value={formatCurrency(totalPipelineAtRisk)}
          sub={`Across ${activeDeals.length} active deals`}
          color="green"
        />
        <StatCard
          label="Open Deal Blockers"
          value={String(openBlockers)}
          sub="Features blocking revenue"
          color="amber"
        />
        <StatCard
          label="Total Deals Tracked"
          value={String(totalDeals)}
          sub={`${activeDeals.length} active`}
          color="blue"
        />
        {topBlockers[0] && (
          <StatCard
            label="Top Priority Score"
            value={`#${topBlockers[0].priorityScore}`}
            sub={topBlockers[0].blocker.title}
            color="white"
          />
        )}
      </div>

      {/* Priority Ranking Table */}
      <div className="section-title">
        <TrendingUp size={14} />
        Priority Ranking — Blockers by Revenue Impact
      </div>

      {topBlockers.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px dashed var(--border-mid)',
            borderRadius: 'var(--radius-md)',
            padding: '40px 24px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            marginBottom: 28,
          }}
        >
          No blockers yet. Add your first deal blocker to see revenue intelligence.
        </div>
      ) : (
        <div className="table-wrap" style={{ marginBottom: 28 }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Feature / Blocker</th>
                <th>Revenue at Stake</th>
                <th>Deals</th>
                <th>Effort</th>
                <th>Urgency</th>
                <th style={{ textAlign: 'right' }}>Priority Score</th>
              </tr>
            </thead>
            <tbody>
              {topBlockers.map((s, i) => {
                const cls = getPriorityClass(s.priorityScore)
                return (
                  <tr
                    key={s.blocker.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onNavigate('blockers')}
                  >
                    <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {i + 1}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, marginBottom: 3 }}>{s.blocker.title}</div>
                      <div className="tags">
                        {s.blocker.tags.map(t => (
                          <span key={t} className="tag">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="mono green">{formatCurrency(s.totalRevenue)}</td>
                    <td className="mono">{s.dealCount}</td>
                    <td><EffortBadge effort={s.blocker.effort} /></td>
                    <td><UrgencyBadge urgency={s.blocker.urgency} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`priority-score ${cls}`}>#{s.priorityScore}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Aha Callout */}
      {topBlockers[0] && topBlockers[0].totalRevenue > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'var(--green-dim)',
            border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 20px',
            marginBottom: 28,
          }}
        >
          <AlertTriangle size={18} color="var(--green)" style={{ flexShrink: 0 }} />
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--green)' }}>
              Build "{topBlockers[0].blocker.title}"
            </span>
            <span style={{ color: 'var(--text-secondary)', marginLeft: 8, fontSize: 13 }}>
              → Unlocks{' '}
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--green)', fontWeight: 700 }}>
                {formatCurrency(topBlockers[0].totalRevenue)}
              </span>{' '}
              across {topBlockers[0].dealCount} active deal{topBlockers[0].dealCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Recent Deals */}
      <div className="section-title">Recent Deals</div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Value</th>
              <th>Stage</th>
              <th>Blockers</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {recentDeals.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                  No deals yet. Add your first deal.
                </td>
              </tr>
            ) : (
              recentDeals.map(deal => (
                <tr key={deal.id} style={{ cursor: 'pointer' }} onClick={() => onNavigate('deals')}>
                  <td style={{ fontWeight: 600 }}>{deal.companyName}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{deal.contactName}</td>
                  <td className="mono green">{formatCurrency(deal.dealValue)}</td>
                  <td><StageBadge stage={deal.stage} /></td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 13,
                        color: deal.blockerIds.length > 0 ? 'var(--amber)' : 'var(--text-muted)',
                      }}
                    >
                      {deal.blockerIds.length}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                    {formatRelativeDate(deal.updatedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
