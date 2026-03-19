import { Blocker, Deal } from '../types'
import { SEED_BLOCKERS, SEED_DEALS } from '../utils/seed'

const KEYS = {
  DEALS: 'dealdesk_deals',
  BLOCKERS: 'dealdesk_blockers',
  SEEDED: 'dealdesk_seeded',
} as const

// ─── Deals ────────────────────────────────────────────────────────────────────

export function loadDeals(): Deal[] {
  try {
    const raw = localStorage.getItem(KEYS.DEALS)
    if (!raw) return []
    return JSON.parse(raw) as Deal[]
  } catch {
    return []
  }
}

export function saveDeals(deals: Deal[]): void {
  localStorage.setItem(KEYS.DEALS, JSON.stringify(deals))
}

// ─── Blockers ─────────────────────────────────────────────────────────────────

export function loadBlockers(): Blocker[] {
  try {
    const raw = localStorage.getItem(KEYS.BLOCKERS)
    if (!raw) return []
    return JSON.parse(raw) as Blocker[]
  } catch {
    return []
  }
}

export function saveBlockers(blockers: Blocker[]): void {
  localStorage.setItem(KEYS.BLOCKERS, JSON.stringify(blockers))
}

// ─── Seed on First Load ────────────────────────────────────────────────────────

export function initStorage(): { deals: Deal[]; blockers: Blocker[] } {
  const alreadySeeded = localStorage.getItem(KEYS.SEEDED)
  if (!alreadySeeded) {
    saveDeals(SEED_DEALS)
    saveBlockers(SEED_BLOCKERS)
    localStorage.setItem(KEYS.SEEDED, 'true')
    return { deals: SEED_DEALS, blockers: SEED_BLOCKERS }
  }
  return { deals: loadDeals(), blockers: loadBlockers() }
}

export function clearStorage(): void {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k))
}
