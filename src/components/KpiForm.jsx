import { useState } from 'react'

const categories = ['Increase','Decrease','Control']
const aggregations = ['Sum','Average']
const frequencies = ['Daily','Weekly','Fortnightly','Monthly']

export default function KpiForm({ onCreated, apiBase }) {
  const [form, setForm] = useState({
    name: '', unit: '', category: 'Increase', weightage: '', start_value: '', target_value: '', aggregation: 'Sum', frequency: 'Monthly'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        name: form.name.trim(),
        unit: form.unit.trim(),
        category: form.category,
        weightage: parseFloat(form.weightage),
        start_value: parseFloat(form.start_value),
        target_value: parseFloat(form.target_value),
        aggregation: form.aggregation,
        frequency: form.frequency
      }
      const res = await fetch(`${apiBase}/api/kpis`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Failed to create KPI')
      const data = await res.json()
      onCreated?.(data)
      setForm({ name: '', unit: '', category: 'Increase', weightage: '', start_value: '', target_value: '', aggregation: 'Sum', frequency: 'Monthly' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/70 backdrop-blur rounded-xl p-4 md:p-6 shadow border">
      <h2 className="text-lg font-semibold mb-4">Create KPI</h2>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">KPI Name</label>
          <input className="mt-1 w-full border rounded px-3 py-2" value={form.name} onChange={e=>update('name', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Unit of Measure</label>
          <input className="mt-1 w-full border rounded px-3 py-2" value={form.unit} onChange={e=>update('unit', e.target.value)} placeholder="%, $, units" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select className="mt-1 w-full border rounded px-3 py-2" value={form.category} onChange={e=>update('category', e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Weightage</label>
          <input type="number" min="0.01" step="0.01" className="mt-1 w-full border rounded px-3 py-2" value={form.weightage} onChange={e=>update('weightage', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Start Value</label>
          <input type="number" step="0.01" className="mt-1 w-full border rounded px-3 py-2" value={form.start_value} onChange={e=>update('start_value', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Target Value</label>
          <input type="number" step="0.01" className="mt-1 w-full border rounded px-3 py-2" value={form.target_value} onChange={e=>update('target_value', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Aggregation Method</label>
          <select className="mt-1 w-full border rounded px-3 py-2" value={form.aggregation} onChange={e=>update('aggregation', e.target.value)}>
            {aggregations.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Frequency</label>
          <select className="mt-1 w-full border rounded px-3 py-2" value={form.frequency} onChange={e=>update('frequency', e.target.value)}>
            {frequencies.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="md:col-span-2 flex gap-3 mt-2">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">{loading ? 'Saving...' : 'Save KPI'}</button>
        </div>
      </form>
    </div>
  )
}
