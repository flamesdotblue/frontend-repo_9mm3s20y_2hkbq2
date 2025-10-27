import { useEffect, useState } from 'react'

export default function WeightedScore({ apiBase, refreshKey }) {
  const [display, setDisplay] = useState('N/A')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${apiBase}/api/weighted-score`)
        const data = await res.json()
        setDisplay(data.display ?? 'N/A')
      } catch (e) {
        setDisplay('N/A')
      }
    }
    load()
  }, [apiBase, refreshKey])

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl p-4 md:p-6 shadow">
      <div className="text-sm opacity-80">Weighted Overall Score</div>
      <div className="text-3xl font-semibold mt-1">{display}</div>
    </div>
  )
}
