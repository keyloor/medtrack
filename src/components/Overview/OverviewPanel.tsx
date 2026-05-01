import type { ReactNode } from 'react'
import { Package, TrendingUp, AlertTriangle, MapPin, Heart, Activity, Scissors } from 'lucide-react'
import KPICard from './KPICard'
import RegionalTrendChart from './RegionalTrendChart'
import AlertsSummary from './AlertsSummary'
import type { Product, Alert, RegionData, Category } from '../../types'

interface Props {
  products: Product[]
  alerts: Alert[]
  regions: RegionData[]
}

interface CategoryConfig {
  label: string
  icon: ReactNode
  iconClass: string
  valueClass: string
  barClass: string
}

const categoryConfig: Record<Category, CategoryConfig> = {
  cardiovascular: {
    label: 'Cardiovascular',
    icon: <Heart className="w-4 h-4" />,
    iconClass: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    valueClass: 'text-rose-500 dark:text-rose-400',
    barClass: 'bg-rose-500',
  },
  orthopedic: {
    label: 'Orthopedic',
    icon: <Activity className="w-4 h-4" />,
    iconClass: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
    valueClass: 'text-sky-500 dark:text-sky-400',
    barClass: 'bg-sky-500',
  },
  surgical: {
    label: 'Surgical',
    icon: <Scissors className="w-4 h-4" />,
    iconClass: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
    valueClass: 'text-violet-500 dark:text-violet-400',
    barClass: 'bg-violet-500',
  },
}

export default function OverviewPanel({ products, alerts, regions }: Props) {
  const totalProducts = products.length
  const totalUnitsSold = products.reduce((sum, p) => sum + p.unitsSoldThisMonth, 0)
  const activeAlerts = alerts.length

  const topRegion = regions.reduce((best, r) => {
    const last = r.monthlyData[r.monthlyData.length - 1].sales
    const bestLast = best.monthlyData[best.monthlyData.length - 1].sales
    return last > bestLast ? r : best
  }, regions[0])

  const categories: Category[] = ['cardiovascular', 'orthopedic', 'surgical']
  const categoryStats = categories.map(cat => {
    const items = products.filter(p => p.category === cat)
    const units = items.reduce((s, p) => s + p.unitsSoldThisMonth, 0)
    return {
      category: cat,
      count: items.length,
      units,
      share: Math.round((units / totalUnitsSold) * 100),
    }
  })

  return (
    <section className="animate-fade-in space-y-6" style={{ animationDelay: '0ms' }}>
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Overview</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
          Key performance indicators — April 2026
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Total Products"
          value={totalProducts}
          subtitle="Active SKUs in inventory"
          icon={<Package className="w-5 h-5" />}
          accent="blue"
          delay={0}
        />
        <KPICard
          title="Units Sold This Month"
          value={totalUnitsSold.toLocaleString()}
          subtitle="Across all categories"
          icon={<TrendingUp className="w-5 h-5" />}
          accent="violet"
          delay={80}
        />
        <KPICard
          title="Active Alerts"
          value={activeAlerts}
          subtitle={activeAlerts > 5 ? 'Action required' : 'Within threshold'}
          icon={<AlertTriangle className="w-5 h-5" />}
          accent={activeAlerts > 5 ? 'red' : 'emerald'}
          delay={160}
        />
        <KPICard
          title="Top Performing Region"
          value={topRegion.name}
          subtitle={`${topRegion.monthlyData[topRegion.monthlyData.length - 1].sales.toLocaleString()} units in Apr`}
          icon={<MapPin className="w-5 h-5" />}
          accent="emerald"
          delay={240}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RegionalTrendChart regions={regions} />
        </div>
        <AlertsSummary alerts={alerts} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {categoryStats.map(({ category, count, units, share }) => {
          const cfg = categoryConfig[category]
          return (
            <div key={category} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg border ${cfg.iconClass}`}>
                  {cfg.icon}
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500">{count} SKUs</span>
              </div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-0.5">{cfg.label}</p>
              <p className={`text-2xl font-bold tracking-tight ${cfg.valueClass}`}>{units.toLocaleString()}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">units sold this month</p>
              <div className="mt-3 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
                <div className={`h-1.5 rounded-full ${cfg.barClass}`} style={{ width: `${share}%` }} />
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{share}% of total sales</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
