import { useState } from 'react'
import { BlockerFormData, Effort, Urgency, BlockerStatus } from '../../types'

const EMPTY_FORM: BlockerFormData = {
  title: '',
  description: '',
  tags: '',
  urgency: 'medium',
  effort: 'medium',
  status: 'open',
}

interface BlockerFormProps {
  initial?: BlockerFormData
  onSubmit: (data: BlockerFormData) => void
  onCancel: () => void
  submitLabel?: string
}

const URGENCY_OPTS: { value: Urgency; label: string }[] = [
  { value: 'high',   label: 'High — Deal-blocker'     },
  { value: 'medium', label: 'Medium — Significant risk' },
  { value: 'low',    label: 'Low — Nice to have'       },
]

const EFFORT_OPTS: { value: Effort; label: string }[] = [
  { value: 'small',  label: 'Small — 1–2 weeks'  },
  { value: 'medium', label: 'Medium — 3–5 weeks' },
  { value: 'large',  label: 'Large — 6+ weeks'   },
]

const STATUS_OPTS: { value: BlockerStatus; label: string }[] = [
  { value: 'open',        label: 'Open'        },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved',    label: 'Resolved'    },
]

export function BlockerForm({ initial, onSubmit, onCancel, submitLabel = 'Add Blocker' }: BlockerFormProps) {
  const [form, setForm] = useState<BlockerFormData>(initial ?? EMPTY_FORM)
  const set = (key: keyof BlockerFormData, value: string) =>
    setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = () => {
    if (!form.title.trim()) return
    onSubmit(form)
  }

  return (
    <div>
      <div className="form-group">
        <label className="form-label">Feature / Blocker Title *</label>
        <input
          className="form-input"
          placeholder="e.g. SSO / SAML Integration"
          value={form.title}
          onChange={e => set('title', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea"
          placeholder="What is the customer asking for and why is it blocking the deal?"
          value={form.description}
          onChange={e => set('description', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Tags</label>
        <input
          className="form-input"
          placeholder="security, enterprise, auth  (comma-separated)"
          value={form.tags}
          onChange={e => set('tags', e.target.value)}
        />
        <p className="form-hint">Comma-separated. Used for clustering related requests.</p>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Urgency</label>
          <select className="form-select" value={form.urgency} onChange={e => set('urgency', e.target.value)}>
            {URGENCY_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Engineering Effort</label>
          <select className="form-select" value={form.effort} onChange={e => set('effort', e.target.value)}>
            {EFFORT_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Status</label>
        <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
          {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={!form.title.trim()}>
          {submitLabel}
        </button>
      </div>
    </div>
  )
}
