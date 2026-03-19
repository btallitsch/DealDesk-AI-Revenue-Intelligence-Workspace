import { useState } from 'react'
import { Plus, ShieldAlert } from 'lucide-react'
import { Blocker } from '../../types'
import { AppStore } from '../../hooks/useAppStore'
import { Modal } from '../shared/Modal'
import { EmptyState } from '../shared/EmptyState'
import { StatCard } from '../shared/StatCard'
import { BlockerCard } from './BlockerCard'
import { BlockerForm } from './BlockerForm'
import { BlockerFormData } from '../../types'
import { formatCurrency } from '../../utils/formatters'

interface BlockersViewProps { store: AppStore }

export function BlockersView({ store }: BlockersViewProps) {
  const { blockers, blockerSummaries, totalPipelineAtRisk, addBlocker, updateBlocker, deleteBlocker } = store
  const [showAdd, setShowAdd] = useState(false)
  const [editBlocker, setEditBlocker] = useState<Blocker | null>(null)

  const openCount     = blockers.filter(b => b.status === 'open').length
  const inProgCount   = blockers.filter(b => b.status === 'in_progress').length
  const resolvedCount = blockers.filter(b => b.status === 'resolved').length

  const handleAdd = (data: BlockerFormData) => {
    addBlocker(data)
    setShowAdd(false)
  }

  const handleEdit = (data: BlockerFormData) => {
    if (!editBlocker) return
    updateBlocker(editBlocker.id, data)
    setEditBlocker(null)
  }

  const toFormData = (b: Blocker): BlockerFormData => ({
    title: b.title,
    description: b.description,
    tags: b.tags.join(', '),
    urgency: b.urgency,
    effort: b.effort,
    status: b.status,
  })

  return (
    <div className="view">
      <div className="view__header">
        <div className="view__title-block">
          <h1 className="view__title">Deal Blockers</h1>
          <p className="view__subtitle">Clustered issues ranked by revenue impact</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={15} /> Add Blocker
        </button>
      </div>

      <div className="stat-grid">
        <StatCard label="Revenue at Risk" value={formatCurrency(totalPipelineAtRisk)} sub="Across active deals" color="green" />
        <StatCard label="Open Blockers" value={String(openCount)} sub="Unresolved issues" color="amber" />
        <StatCard label="In Progress" value={String(inProgCount)} sub="Being built" color="blue" />
        <StatCard label="Resolved" value={String(resolvedCount)} sub="Fixed issues" color="white" />
      </div>

      {/* Blocker list */}
      {blockerSummaries.length === 0 ? (
        <EmptyState
          icon={<ShieldAlert size={20} />}
          title="No blockers yet"
          body="Add your first deal blocker — a feature or gap preventing deals from closing — to see revenue impact."
          action={
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
              <Plus size={14} /> Add First Blocker
            </button>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {blockerSummaries.map((s, i) => (
            <BlockerCard
              key={s.blocker.id}
              summary={s}
              rank={i + 1}
              onEdit={() => setEditBlocker(s.blocker)}
              onDelete={() => deleteBlocker(s.blocker.id)}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <Modal title="Add Deal Blocker" onClose={() => setShowAdd(false)}>
          <BlockerForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
        </Modal>
      )}

      {/* Edit Modal */}
      {editBlocker && (
        <Modal title="Edit Blocker" onClose={() => setEditBlocker(null)}>
          <BlockerForm
            initial={toFormData(editBlocker)}
            onSubmit={handleEdit}
            onCancel={() => setEditBlocker(null)}
            submitLabel="Save Changes"
          />
        </Modal>
      )}
    </div>
  )
}
