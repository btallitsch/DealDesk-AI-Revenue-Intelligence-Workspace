// ─── Enums / Unions ────────────────────────────────────────────────────────────

export type DealStage =
  | 'discovery'
  | 'demo'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost'

export type Urgency = 'low' | 'medium' | 'high'
export type Effort = 'small' | 'medium' | 'large'
export type BlockerStatus = 'open' | 'in_progress' | 'resolved'
export type View = 'dashboard' | 'deals' | 'blockers' | 'planning'

// ─── Core Entities ─────────────────────────────────────────────────────────────

export interface Deal {
  id: string
  companyName: string
  contactName: string
  dealValue: number
  stage: DealStage
  blockerIds: string[]
  notes: string
  createdAt: string
  updatedAt: string
}

export interface Blocker {
  id: string
  title: string
  description: string
  tags: string[]
  urgency: Urgency
  effort: Effort
  status: BlockerStatus
  createdAt: string
}

// ─── Derived / Computed ────────────────────────────────────────────────────────

export interface BlockerSummary {
  blocker: Blocker
  deals: Deal[]
  totalRevenue: number
  dealCount: number
  priorityScore: number
}

// ─── Form Shapes ───────────────────────────────────────────────────────────────

export interface DealFormData {
  companyName: string
  contactName: string
  dealValue: string
  stage: DealStage
  blockerIds: string[]
  notes: string
}

export interface BlockerFormData {
  title: string
  description: string
  tags: string
  urgency: Urgency
  effort: Effort
  status: BlockerStatus
}
