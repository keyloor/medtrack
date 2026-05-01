import { Package, TrendingUp, AlertTriangle, MapPin } from 'lucide-react'
import KPICard from './KPICard'
import type { Product, Alert, RegionData } from '../../types'

interface Props {
  products: Product[]
  alerts: Alert[]
  regions: RegionData[]
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

  return (
    <section className="animate-fade-in" style={{ animationDelay: '0ms' }}>
      <div className="mb-6">
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
    </section>
  )
}
