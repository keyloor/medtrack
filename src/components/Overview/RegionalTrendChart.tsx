import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { RegionData } from '../../types'

interface Props {
  regions: RegionData[]
}

export default function RegionalTrendChart({ regions }: Props) {
  const data = regions[0].monthlyData.slice(-6).map((point, i) => {
    const entry: Record<string, string | number> = { month: point.month }
    regions.forEach(r => { entry[r.name] = r.monthlyData.slice(-6)[i].sales })
    return entry
  })

  return (
    <div className="card p-5 h-full">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-white mb-0.5">Regional Sales Trend</h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last 6 months · units sold</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
          <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid rgba(51,65,85,0.8)',
              borderRadius: 10,
              fontSize: 12,
            }}
            labelStyle={{ color: '#f1f5f9', fontWeight: 600 }}
            itemStyle={{ color: '#94a3b8' }}
          />
          {regions.map(r => (
            <Line
              key={r.id}
              type="monotone"
              dataKey={r.name}
              stroke={r.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
        {regions.map(r => (
          <span key={r.id} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
            {r.name}
          </span>
        ))}
      </div>
    </div>
  )
}
