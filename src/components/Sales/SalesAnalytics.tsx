import { lazy, Suspense } from 'react'
import {
  LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { Globe2 } from 'lucide-react'
import type { Product, RegionData } from '../../types'

const RegionalGlobe = lazy(() => import('./RegionalGlobe'))

interface Props {
  products: Product[]
  regions: RegionData[]
  darkMode: boolean
}

const categoryColors: Record<string, string> = {
  cardiovascular: '#3b82f6',
  orthopedic:     '#8b5cf6',
  surgical:       '#10b981',
}

export default function SalesAnalytics({ products, regions, darkMode }: Props) {
  // Transform regions → recharts format: [{month, "North America": 1240, ...}]
  const months = regions[0].monthlyData.map((d) => d.month)
  const lineData = months.map((month, i) => {
    const entry: Record<string, string | number> = { month }
    regions.forEach((r) => {
      entry[r.name] = r.monthlyData[i].sales
    })
    return entry
  })

  // Category bar data
  const categoryMap: Record<string, number> = {}
  products.forEach((p) => {
    categoryMap[p.category] = (categoryMap[p.category] ?? 0) + p.unitsSoldThisMonth
  })
  const barData = Object.entries(categoryMap).map(([category, units]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    units,
    fill: categoryColors[category],
  }))

  const axisColor     = darkMode ? '#94a3b8' : '#64748b'
  const gridColor     = darkMode ? '#1e293b' : '#f1f5f9'
  const tooltipBg     = darkMode ? '#1e293b' : '#ffffff'
  const tooltipBorder = darkMode ? '#334155' : '#e2e8f0'
  const tooltipText   = darkMode ? '#f1f5f9' : '#0f172a'

  return (
    <section className="animate-fade-in space-y-8" style={{ animationDelay: '0ms' }}>
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Sales Analytics</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
          Regional trends and category performance — May 2025 – Apr 2026
        </p>
      </div>

      {/* 3D Globe */}
      <div className="card p-6 animate-fade-in-up overflow-hidden" style={{ animationDelay: '20ms', opacity: 0 }}>
        <div className="flex items-center gap-2 mb-4">
          <Globe2 className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
            Global Sales — Live View
          </h3>
          <span className="ml-auto text-[11px] text-slate-400 dark:text-slate-500 hidden sm:block">
            Drag to rotate · Auto-rotates when idle
          </span>
        </div>
        <Suspense
          fallback={
            <div className="h-[420px] flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                Loading globe…
              </div>
            </div>
          }
        >
          <RegionalGlobe regions={regions} darkMode={darkMode} />
        </Suspense>
      </div>

      {/* Line chart */}
      <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '40ms', opacity: 0 }}>
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-5 uppercase tracking-wide">
          Monthly Sales by Region
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={lineData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 12, color: tooltipText, fontSize: 13 }}
              labelStyle={{ fontWeight: 600, marginBottom: 4 }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
            {regions.map((r) => (
              <Line
                key={r.name}
                type="monotone"
                dataKey={r.name}
                stroke={r.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart */}
      <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '120ms', opacity: 0 }}>
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-5 uppercase tracking-wide">
          Units Sold by Category — This Month
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }} barSize={52}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="category" tick={{ fill: axisColor, fontSize: 13, fontWeight: 500 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 12, color: tooltipText, fontSize: 13 }}
              cursor={{ fill: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}
            />
            <Bar dataKey="units" radius={[6, 6, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Category legend */}
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {barData.map((d) => (
            <div key={d.category} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="w-3 h-3 rounded-sm" style={{ background: d.fill }} />
              {d.category}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
