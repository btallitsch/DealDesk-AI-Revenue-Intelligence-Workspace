import { useState } from 'react'
import { Plus, Search, Briefcase } from 'lucide-react'
import { Deal } from '../../types'
import { AppStore } from '../../hooks/useAppStore'
import { Modal } from '../shared/Modal'
import { EmptyState } from '../shared/EmptyState'
import { StatCard } from '../shared/StatCard'
import { DealCard } from './DealCard'
import { DealForm } from './DealForm'
import { DealFormData } from '../../types'
import { formatCurrency } from '../../utils/formatters'

interface DealsViewProps { store: AppStore }

export function DealsView({ store }: DealsViewProps) {
  const { deals, blockers, activeDeals, addDeal, updateDeal, deleteDeal } = store
  const [showAdd, setShowAdd] = useState(false)
  const [editDeal, setEditDeal] = useState<Deal | null>(null)
  const [search, setSearch] = useState('')

  const filtered = deals.filter(d =>
    d.companyName.toLowerCase().includes(search.toLowerCase()) ||
    d.contactName.toLowerCase().includes(search.toLowerCase()),
  )

  const totalValue = deals.reduce((s, d) => s + d.dealValue, 0)
  const activeValue = activeDeals.reduce((s, d) => s + d.dealValue, 0)
  const blockedCount = deals.filter(d => d.blockerIds.length > 0).length

  const handleAdd = (data: DealFormData) => {
    addDeal(data)
    setShowAdd(false)
  }

  const handleEdit = (data: DealFormData) => {
    if (!editDeal) return
    updateDeal(editDeal.id, data)
    setEditDeal(null)
  }

  const toFormData = (deal: Deal): DealFormData => ({
    companyName: deal.companyName,
    contactName: deal.contactName,
    dealValue: String(deal.dealValue),
    stage: deal.stage,
    blockerIds: deal.blockerIds,
    notes: deal.notes,
  })

  return (
    <div className="view">
      <div className="view__header">
        <div className="view__title-block">
          <h1 className="view__title">Deals</h1>
          <p className="view__subtitle">Track every opportunity and its blockers</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={15} /> Add Deal
        </button>
      </div>

      <div className="stat-grid">
        <StatCard label="Total Deals" value={String(deals.length)} sub="All tracked deals" color="white" />
        <StatCard label="Active Pipeline" value={formatCurrency(activeValue)} sub={`${activeDeals.length} active deals`} color="green" />
        <StatCard label="Total Value" value={formatCurrency(totalValue)} sub="Including closed" color="blue" />
        <StatCard label="Deals with Blockers" value={String(blockedCount)} sub="Have open issues" color="amber" />
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          className="form-input"
          style={{ paddingLeft: 36 }}
          placeholder="Search by company or contact…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Deal Cards */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={20} />}
          title="No deals yet"
          body="Add your first deal and link it to deal blockers to start tracking revenue at risk."
          action={
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
              <Plus size={14} /> Add First Deal
            </button>
          }
        />
      ) : (
        <div className="card-grid">
          {filtered.map(deal => (
            <DealCard
              key={deal.id}
              deal={deal}
              blockers={blockers}
              onEdit={() => setEditDeal(deal)}
              onDelete={() => deleteDeal(deal.id)}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <Modal title="Add New Deal" onClose={() => setShowAdd(false)}>
          <DealForm blockers={blockers} onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
        </Modal>
      )}

      {/* Edit Modal */}
      {editDeal && (
        <Modal title="Edit Deal" onClose={() => setEditDeal(null)}>
          <DealForm
            blockers={blockers}
            initial={toFormData(editDeal)}
            onSubmit={handleEdit}
            onCancel={() => setEditDeal(null)}
            submitLabel="Save Changes"
          />
        </Modal>
      )}
    </div>
  )
}
