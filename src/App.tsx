import { useState } from 'react'
import { View } from './types'
import { useAppStore } from './hooks/useAppStore'
import { Nav } from './components/shared/Nav'
import { Dashboard } from './components/Dashboard'
import { DealsView } from './components/DealsView'
import { BlockersView } from './components/BlockersView'
import { FeaturePlanningView } from './components/FeaturePlanningView'

export default function App() {
  const [activeView, setActiveView] = useState<View>('dashboard')
  const store = useAppStore()

  function renderView() {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            store={store}
            onNavigate={v => setActiveView(v)}
          />
        )
      case 'deals':
        return <DealsView store={store} />
      case 'blockers':
        return <BlockersView store={store} />
      case 'planning':
        return <FeaturePlanningView store={store} />
    }
  }

  return (
    <div className="app">
      <Nav
        activeView={activeView}
        onViewChange={setActiveView}
        totalPipelineAtRisk={store.totalPipelineAtRisk}
        openBlockerCount={store.openBlockerCount}
      />
      <main className="main">{renderView()}</main>
    </div>
  )
}
