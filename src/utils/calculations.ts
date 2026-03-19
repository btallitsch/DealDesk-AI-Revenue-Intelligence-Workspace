import { Blocker, BlockerSummary, Deal, Effort, Urgency } from '../types'

// ─── Weights & Labels ──────────────────────────────────────────────────────────

export const URGENCY_WEIGHTS: Record<Urgency, number> = {
  low: 1.0,
  medium: 1.5,
  high: 2.5,
}

export const EFFORT_POINTS: Record<Effort, number> = {
  small: 2,
  medium: 5,
  large: 13,
}

export const EFFORT_LABELS: Record<Effort, string> = {
  small: 'Small · 1–2 wks',
  medium: 'Medium · 3–5 wks',
  large: 'Large · 6+ wks',
}

export const URGENCY_LABELS: Record<Urgency, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export const STAGE_LABELS: Record<string, string> = {
  discovery: 'Discovery',
  demo: 'Demo',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
}

// ─── Priority Score ────────────────────────────────────────────────────────────
// Formula: (revenue / 1000) × urgencyWeight × log₂(dealCount + 2) / effortPoints
// Yields a dimensionless score useful for ranking.

export function computePriorityScore(
  totalRevenue: number,
  urgency: Urgency,
  effort: Effort,
  dealCount: number,
): number {
  const uw = URGENCY_WEIGHTS[urgency]
  const ep = EFFORT_POINTS[effort]
  const raw = (totalRevenue / 1000) * uw * Math.log2(dealCount + 2) / ep
  return Math.round(raw)
}

// ─── Blocker Summaries ─────────────────────────────────────────────────────────
// Only counts active (non-closed) deals in revenue totals.

export function computeBlockerSummaries(
  blockers: Blocker[],
  deals: Deal[],
): BlockerSummary[] {
  return blockers
    .map(blocker => {
      const relatedDeals = deals.filter(
        d =>
          d.blockerIds.includes(blocker.id) &&
          d.stage !== 'closed_won' &&
          d.stage !== 'closed_lost',
      )
      const totalRevenue = relatedDeals.reduce((sum, d) => sum + d.dealValue, 0)
      const dealCount = relatedDeals.length
      const priorityScore = computePriorityScore(
        totalRevenue,
        blocker.urgency,
        blocker.effort,
        dealCount,
      )
      return { blocker, deals: relatedDeals, totalRevenue, dealCount, priorityScore }
    })
    .sort((a, b) => b.priorityScore - a.priorityScore)
}

// ─── Aggregate Helpers ─────────────────────────────────────────────────────────

export function getUniquePipelineAtRisk(summaries: BlockerSummary[]): number {
  const seen = new Set<string>()
  let total = 0
  for (const s of summaries) {
    for (const deal of s.deals) {
      if (!seen.has(deal.id)) {
        seen.add(deal.id)
        total += deal.dealValue
      }
    }
  }
  return total
}

export function getTopBlocker(summaries: BlockerSummary[]): BlockerSummary | null {
  return summaries.length > 0 ? summaries[0] : null
}
