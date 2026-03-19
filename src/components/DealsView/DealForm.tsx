import { useState } from 'react'
import { DealFormData, DealStage, Blocker } from '../../types'

const EMPTY_FORM: DealFormData = {
  companyName: '',
  contactName: '',
  dealValue: '',
  stage: 'discovery',
  blockerIds: [],
  notes: '',
}

interface DealFormProps {
  blockers: Blocker[]
  initial?: DealFormData
  onSubmit: (data: DealFormData) => void
  onCancel: () => void
  submitLabel?: string
}

const STAGES: { value: DealStage; label: string }[] = [
  { value: 'discovery',   label: 'Discovery'   },
  { value: 'demo',        label: 'Demo'        },
  { value: 'proposal',    label: 'Proposal'    },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed_won',  label: 'Closed Won'  },
  { value: 'closed_lost', label: 'Closed Lost' },
]

export function DealForm({ blockers, initial, onSubmit, onCancel, submitLabel = 'Add Deal' }: DealFormProps) {
  const [form, setForm] = useState<DealFormData>(initial ?? EMPTY_FORM)

  const set = (key: keyof DealFormData, value: string | string[]) =>
    setForm(f => ({ ...f, [key]: value }))

  const toggleBlocker = (id: string) =>
    set(
      'blockerIds',
      form.blockerIds.includes(id)
        ? form.blockerIds.filter(b => b !== id)
        : [...form.blockerIds, id],
    )

  const handleSubmit = () => {
    if (!form.companyName.trim() || !form.dealValue) return
    onSubmit(form)
  }

  return (
    <div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Company Name *</label>
          <input
            className="form-input"
            placeholder="Acme Corp"
            value={form.companyName}
            onChange={e => set('companyName', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Contact Name</label>
          <input
            className="form-input"
            placeholder="Jane Smith"
            value={form.contactName}
            onChange={e => set('contactName', e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Deal Value ($) *</label>
          <input
            className="form-input"
            type="number"
            placeholder="50000"
            value={form.dealValue}
            onChange={e => set('dealValue', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Stage</label>
          <select
            className="form-select"
            value={form.stage}
            onChange={e => set('stage', e.target.value)}
          >
            {STAGES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Deal Blockers</label>
        {blockers.length === 0 ? (
          <p className="form-hint">No blockers yet. Add blockers first, then link them to deals.</p>
        ) : (
          <div className="blocker-select-list">
            {blockers.map(b => (
              <label
                key={b.id}
                className={`blocker-select-item ${form.blockerIds.includes(b.id) ? 'selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={form.blockerIds.includes(b.id)}
                  onChange={() => toggleBlocker(b.id)}
                />
                <span className="blocker-select-item__label">{b.title}</span>
              </label>
            ))}
          </div>
        )}
        <p className="form-hint">Select all blockers preventing this deal from closing.</p>
      </div>

      <div className="form-group">
        <label className="form-label">Notes</label>
        <textarea
          className="form-textarea"
          placeholder="Context, objections, champion info..."
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!form.companyName.trim() || !form.dealValue}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  )
}
