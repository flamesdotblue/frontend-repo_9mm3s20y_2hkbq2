import { useEffect, useMemo, useState } from 'react'

function computeActual(values, aggregation) {
  if (!values.length) return 0
  const nums = values.map(v => Number(v) || 0)
  if (aggregation === 'Sum') return nums.reduce((a,b) => a+b, 0)
  return nums.reduce((a,b) => a+b, 0) / nums.length
}

function clamp(p) { return Math.max(0, Math.min(100, p)) }

function computePercentage(category, actual, start, target) {
  if ((category === 'Increase' || category === 'Decrease') && start === target) return 0
  if (category === 'Increase') return clamp(((actual - start) / (target - start)) * 100)
  if (category === 'Decrease') return clamp(((start - actual) / (start - target)) * 100)
  // Control
  if ((start <= actual && actual <= target) || (target <= actual && actual <= start)) return 100
  return 0
}

export default function KpiDataForm({ kpi, apiBase, onSaved, onBack }) {
  const count = useMemo(() => ({ Daily: 30, Weekly: 5, Fortnightly: 2, Monthly: 1 })[kpi.frequency] || 1, [kpi.frequency])
  const [values, setValues] = useState(() => Array(count).fill(''))
  const [saving, setSaving] = useState(false)
  const [serverResult, setServerResult] = useState(null)

  useEffect(() => { setValues(Array(count).fill('')) }, [count])

  const actual = computeActual(values.filter(v => v !== ''), kpi.aggregation)
  const percentage = computePercentage(kpi.category, actual, Number(kpi.start_value), Number(kpi.target_value))

  const labels = useMemo(() => {
    if (kpi.frequency === 'Daily') return Array.from({length: count}, (_,i)=>`Day ${i+1}`)
    if (kpi.frequency === 'Weekly') return Array.from({length: count}, (_,i)=>`Week ${i+1}`)
    if (kpi.frequency === 'Fortnightly') return ['Fortnight 1','Fortnight 2']
    return ['Monthly Value']
  }, [kpi.frequency, count])

  const updateVal = (idx, v) => setValues(prev => prev.map((x,i)=> i===idx ? v : x))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { kpi_id: kpi.id, values: values.map(v => Number(v || 0)) }
      const res = await fetch(`${apiBase}/api/kpis/${kpi.id}/data`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Failed to save data')
      const data = await res.json()
      setServerResult(data)
      onSaved?.()
    } catch (err) {
      // handle silently for now
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white/70 backdrop-blur rounded-xl p-4 md:p-6 shadow border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Enter Data: {kpi.name}</h2>
        <button onClick={onBack} className="text-sm text-indigo-600 hover:underline">Back</button>
      </div>
      <form onSubmit={save} className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {labels.map((label, idx) => (
            <div key={idx} className="flex flex-col">
              <label className="text-sm text-gray-600">{label}</label>
              <input type="number" step="0.01" className="mt-1 border rounded px-3 py-2" value={values[idx]} onChange={e=>updateVal(idx, e.target.value)} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 border rounded p-3">
            <div className="text-xs text-gray-500">Aggregation</div>
            <div className="font-medium">{kpi.aggregation}</div>
          </div>
          <div className="bg-gray-50 border rounded p-3">
            <div className="text-xs text-gray-500">Actual Value</div>
            <div className="font-medium">{Number.isFinite(actual) ? actual.toFixed(2) : '—'} {kpi.unit}</div>
          </div>
          <div className="bg-gray-50 border rounded p-3">
            <div className="text-xs text-gray-500">Percentage</div>
            <div className="font-medium">{Number.isFinite(percentage) ? percentage.toFixed(2) : '—'}%</div>
          </div>
        </div>
        {serverResult && (
          <div className="text-sm text-green-700">Saved. Server calculated Actual = {serverResult.actual?.toFixed?.(2) ?? serverResult.actual} {kpi.unit}, Percentage = {serverResult.percentage?.toFixed?.(2) ?? serverResult.percentage}%</div>
        )}
        <div>
          <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">{saving ? 'Saving...' : 'Save Data'}</button>
        </div>
      </form>
    </div>
  )
}
