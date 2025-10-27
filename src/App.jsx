import { useEffect, useState } from 'react'
import KpiForm from './components/KpiForm'
import KpiList from './components/KpiList'
import KpiDataForm from './components/KpiDataForm'
import WeightedScore from './components/WeightedScore'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [kpis, setKpis] = useState([])
  const [view, setView] = useState('home')
  const [selected, setSelected] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const load = async () => {
    const res = await fetch(`${API_BASE}/api/kpis`)
    const data = await res.json()
    setKpis(data)
    setRefreshKey(k => k+1)
  }

  useEffect(() => { load() }, [])

  const enterData = (kpi) => {
    setSelected(kpi)
    setView('data')
  }

  const goHome = () => { setView('home'); setSelected(null); load() }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Performance Management System</h1>
          <div className="flex items-center gap-3">
            <button onClick={goHome} className={`px-3 py-1.5 rounded ${view==='home'?'bg-slate-900 text-white':'bg-slate-100'}`}>Home</button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <WeightedScore apiBase={API_BASE} refreshKey={refreshKey} />
        {view === 'home' && (
          <>
            <KpiForm apiBase={API_BASE} onCreated={load} />
            <KpiList kpis={kpis} onEnterData={enterData} />
          </>
        )}
        {view === 'data' && selected && (
          <KpiDataForm apiBase={API_BASE} kpi={selected} onSaved={load} onBack={goHome} />
        )}
      </main>
      <footer className="max-w-6xl mx-auto px-4 pb-10 text-sm text-gray-500">Single-user demo. Create KPIs, enter values, and see the weighted score update.</footer>
    </div>
  )
}
