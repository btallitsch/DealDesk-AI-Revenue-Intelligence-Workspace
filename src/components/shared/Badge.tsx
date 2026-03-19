import { Effort, Urgency, BlockerStatus, DealStage } from '../../types'

// ─── Urgency Badge ─────────────────────────────────────────────────────────────

const URGENCY_CLASS: Record<Urgency, string> = {
  high: 'badge-red',
  medium: 'badge-amber',
  low: 'badge-neutral',
}

const URGENCY_DOT: Record<Urgency, string> = {
  high: '●',
  medium: '●',
  low: '●',
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <span className={`badge ${URGENCY_CLASS[urgency]}`}>
      <span style={{ fontSize: 8 }}>{URGENCY_DOT[urgency]}</span>
      {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
    </span>
  )
}

// ─── Effort Badge ──────────────────────────────────────────────────────────────

const EFFORT_CLASS: Record<Effort, string> = {
  small: 'badge-green',
  medium: 'badge-amber',
  large: 'badge-red',
}

const EFFORT_LABEL: Record<Effort, string> = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
}

export function EffortBadge({ effort }: { effort: Effort }) {
  return (
    <span className={`badge ${EFFORT_CLASS[effort]}`}>{EFFORT_LABEL[effort]}</span>
  )
}

// ─── Status Badge ──────────────────────────────────────────────────────────────

const STATUS_CLASS: Record<BlockerStatus, string> = {
  open: 'badge-amber',
  in_progress: 'badge-blue',
  resolved: 'badge-green',
}

const STATUS_LABEL: Record<BlockerStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
}

export function StatusBadge({ status }: { status: BlockerStatus }) {
  return (
    <span className={`badge ${STATUS_CLASS[status]}`}>{STATUS_LABEL[status]}</span>
  )
}

// ─── Stage Badge ───────────────────────────────────────────────────────────────

const STAGE_CLASS: Record<DealStage, string> = {
  discovery: 'badge-neutral',
  demo: 'badge-blue',
  proposal: 'badge-amber',
  negotiation: 'badge-red',
  closed_won: 'badge-green',
  closed_lost: 'badge-neutral',
}

const STAGE_LABEL: Record<DealStage, string> = {
  discovery: 'Discovery',
  demo: 'Demo',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
}

export function StageBadge({ stage }: { stage: DealStage }) {
  return (
    <span className={`badge ${STAGE_CLASS[stage]}`}>{STAGE_LABEL[stage]}</span>
  )
}
