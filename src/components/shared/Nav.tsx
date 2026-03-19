import { LayoutDashboard, Briefcase, ShieldAlert, BarChart3, Zap } from 'lucide-react'
import { View } from '../../types'
import { formatCurrency } from '../../utils/formatters'

interface NavProps {
  activeView: View
  onViewChange: (v: View) => void
  totalPipelineAtRisk: number
  openBlockerCount: number
}

const NAV_ITEMS: { view: View; label: string; icon: typeof LayoutDashboard }[] = [
  { view: 'dashboard', label: 'Dashboard',       icon: LayoutDashboard },
  { view: 'deals',     label: 'Deals',           icon: Briefcase       },
  { view: 'blockers',  label: 'Blockers',        icon: ShieldAlert     },
  { view: 'planning',  label: 'Feature Planning', icon: BarChart3      },
]

export function Nav({ activeView, onViewChange, totalPipelineAtRisk, openBlockerCount }: NavProps) {
  return (
    <nav className="nav">
      <div className="nav__brand">
        <div className="nav__logo">
          <div className="nav__logo-icon">
            <Zap size={16} />
          </div>
          <div>
            <div className="nav__logo-text">DealDesk AI</div>
            <div className="nav__logo-sub">Revenue Intel</div>
          </div>
        </div>
      </div>

      <div className="nav__section-label">Workspace</div>

      {NAV_ITEMS.map(({ view, label, icon: Icon }) => (
        <button
          key={view}
          className={`nav__item ${activeView === view ? 'active' : ''}`}
          onClick={() => onViewChange(view)}
        >
          <Icon className="nav__item-icon" size={16} />
          {label}
          {view === 'blockers' && openBlockerCount > 0 && (
            <span
              style={{
                marginLeft: 'auto',
                background: 'var(--amber-dim)',
                border: '1px solid rgba(245,158,11,0.2)',
                color: 'var(--amber)',
                fontSize: 10,
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: 99,
                fontFamily: 'var(--font-mono)',
              }}
            >
              {openBlockerCount}
            </span>
          )}
        </button>
      ))}

      <div className="nav__footer">
        <div className="nav__stat">
          <span>Pipeline at Risk</span>
          <span className="nav__stat-value">{formatCurrency(totalPipelineAtRisk)}</span>
        </div>
      </div>
    </nav>
  )
}
