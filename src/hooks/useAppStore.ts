import { useCallback, useMemo, useState } from 'react'
import { Blocker, BlockerFormData, Deal, DealFormData } from '../types'
import { computeBlockerSummaries, getUniquePipelineAtRisk } from '../utils/calculations'
import { generateId } from '../utils/formatters'
import { initStorage, saveBlockers, saveDeals } from '../services/storage'

// ─── Initial State ─────────────────────────────────────────────────────────────

const { deals: initialDeals, blockers: initialBlockers } = initStorage()

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAppStore() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals)
  const [blockers, setBlockers] = useState<Blocker[]>(initialBlockers)

  // ── Deals CRUD ──────────────────────────────────────────────────────────────

  const addDeal = useCallback((data: DealFormData) => {
    const now = new Date().toISOString()
    const deal: Deal = {
      id: generateId(),
      companyName: data.companyName.trim(),
      contactName: data.contactName.trim(),
      dealValue: parseFloat(data.dealValue) || 0,
      stage: data.stage,
      blockerIds: data.blockerIds,
      notes: data.notes.trim(),
      createdAt: now,
      updatedAt: now,
    }
    setDeals(prev => {
      const next = [deal, ...prev]
      saveDeals(next)
      return next
    })
  }, [])

  const updateDeal = useCallback((id: string, data: Partial<DealFormData>) => {
    setDeals(prev => {
      const next = prev.map(d => {
        if (d.id !== id) return d
        return {
          ...d,
          ...(data.companyName !== undefined && { companyName: data.companyName.trim() }),
          ...(data.contactName !== undefined && { contactName: data.contactName.trim() }),
          ...(data.dealValue !== undefined && { dealValue: parseFloat(data.dealValue) || 0 }),
          ...(data.stage !== undefined && { stage: data.stage }),
          ...(data.blockerIds !== undefined && { blockerIds: data.blockerIds }),
          ...(data.notes !== undefined && { notes: data.notes.trim() }),
          updatedAt: new Date().toISOString(),
        }
      })
      saveDeals(next)
      return next
    })
  }, [])

  const deleteDeal = useCallback((id: string) => {
    setDeals(prev => {
      const next = prev.filter(d => d.id !== id)
      saveDeals(next)
      return next
    })
  }, [])

  // ── Blockers CRUD ───────────────────────────────────────────────────────────

  const addBlocker = useCallback((data: BlockerFormData) => {
    const blocker: Blocker = {
      id: generateId(),
      title: data.title.trim(),
      description: data.description.trim(),
      tags: data.tags
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean),
      urgency: data.urgency,
      effort: data.effort,
      status: data.status,
      createdAt: new Date().toISOString(),
    }
    setBlockers(prev => {
      const next = [blocker, ...prev]
      saveBlockers(next)
      return next
    })
  }, [])

  const updateBlocker = useCallback((id: string, data: Partial<BlockerFormData>) => {
    setBlockers(prev => {
      const next = prev.map(b => {
        if (b.id !== id) return b
        return {
          ...b,
          ...(data.title !== undefined && { title: data.title.trim() }),
          ...(data.description !== undefined && { description: data.description.trim() }),
          ...(data.tags !== undefined && {
            tags: data.tags
              .split(',')
              .map(t => t.trim().toLowerCase())
              .filter(Boolean),
          }),
          ...(data.urgency !== undefined && { urgency: data.urgency }),
          ...(data.effort !== undefined && { effort: data.effort }),
          ...(data.status !== undefined && { status: data.status }),
        }
      })
      saveBlockers(next)
      return next
    })
  }, [])

  const deleteBlocker = useCallback((id: string) => {
    setBlockers(prev => {
      const next = prev.filter(b => b.id !== id)
      saveBlockers(next)
      return next
    })
    // Remove blocker reference from all deals
    setDeals(prev => {
      const next = prev.map(d => ({
        ...d,
        blockerIds: d.blockerIds.filter(bid => bid !== id),
      }))
      saveDeals(next)
      return next
    })
  }, [])

  // ── Derived Data ────────────────────────────────────────────────────────────

  const blockerSummaries = useMemo(
    () => computeBlockerSummaries(blockers, deals),
    [blockers, deals],
  )

  const totalPipelineAtRisk = useMemo(
    () => getUniquePipelineAtRisk(blockerSummaries),
    [blockerSummaries],
  )

  const openBlockerCount = useMemo(
    () => blockers.filter(b => b.status === 'open').length,
    [blockers],
  )

  const activeDeals = useMemo(
    () => deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost'),
    [deals],
  )

  return {
    // Raw state
    deals,
    blockers,
    // Derived
    blockerSummaries,
    totalPipelineAtRisk,
    openBlockerCount,
    activeDeals,
    // Actions
    addDeal,
    updateDeal,
    deleteDeal,
    addBlocker,
    updateBlocker,
    deleteBlocker,
  }
}

export type AppStore = ReturnType<typeof useAppStore>
