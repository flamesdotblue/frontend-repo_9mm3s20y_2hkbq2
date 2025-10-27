export default function KpiList({ kpis, onEnterData }) {
  return (
    <div className="bg-white/70 backdrop-blur rounded-xl p-4 md:p-6 shadow border">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">KPIs</h2>
      </div>
      {kpis.length === 0 ? (
        <div className="text-sm text-gray-600">No KPIs yet. Add one using the form.</div>
      ) : (
        <div className="divide-y">
          {kpis.map(k => (
            <div key={k.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <div className="font-medium">{k.name} <span className="text-xs text-gray-500">({k.category}, {k.aggregation}, {k.frequency})</span></div>
                <div className="text-sm text-gray-600">Weightage: {k.weightage} | Start: {k.start_value} | Target: {k.target_value} | Unit: {k.unit}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-gray-500">Actual:</span> {k.data?.actual ?? '—'} {k.unit}
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Percentage:</span> {k.data?.percentage != null ? `${k.data.percentage.toFixed(2)}%` : '—'}
                </div>
                <button onClick={() => onEnterData(k)} className="px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700">Enter Data</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
