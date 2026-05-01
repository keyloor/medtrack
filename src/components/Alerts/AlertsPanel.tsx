import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import type { Alert, Severity } from '../../types'

interface Props {
  alerts: Alert[]
}

const severityOrder: Record<Severity, number> = { high: 0, medium: 1, low: 2 }

const severityConfig: Record<Severity, {
  label: string
  badgeClass: string
  cardClass: string
  Icon: typeof AlertTriangle
  iconClass: string
}> = {
  high: {
    label: 'High',
    badgeClass: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
    cardClass:  'border-l-4 border-l-red-500 dark:border-l-red-500',
    Icon: AlertTriangle,
    iconClass: 'text-red-500 dark:text-red-400',
  },
  medium: {
    label: 'Medium',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    cardClass:  'border-l-4 border-l-amber-500 dark:border-l-amber-400',
    Icon: AlertCircle,
    iconClass: 'text-amber-500 dark:text-amber-400',
  },
  low: {
    label: 'Low',
    badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
    cardClass:  'border-l-4 border-l-blue-400 dark:border-l-blue-400',
    Icon: Info,
    iconClass: 'text-blue-500 dark:text-blue-400',
  },
}

export default function AlertsPanel({ alerts }: Props) {
  const sorted = [...alerts].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  )

  const counts = { high: 0, medium: 0, low: 0 }
  alerts.forEach((a) => counts[a.severity]++)

  return (
    <section className="animate-fade-in" style={{ animationDelay: '0ms' }}>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Alerts</h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
            {alerts.length} active inventory alerts
          </p>
        </div>
        {/* Summary chips */}
        <div className="flex gap-2">
          {(['high', 'medium', 'low'] as Severity[]).map((sev) => {
            const cfg = severityConfig[sev]
            return (
              <span key={sev} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.badgeClass}`}>
                <cfg.Icon className="w-3.5 h-3.5" />
                {counts[sev]} {cfg.label}
              </span>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {sorted.map((alert, i) => {
          const cfg = severityConfig[alert.severity]
          const pct = Math.min(100, Math.round((alert.currentStock / alert.minimumRequired) * 100))

          return (
            <div
              key={alert.id}
              className={`card p-5 flex flex-col gap-4 animate-fade-in-up ${cfg.cardClass}`}
              style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <cfg.Icon className={`w-5 h-5 flex-shrink-0 ${cfg.iconClass}`} />
                  <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">
                    {alert.product}
                  </span>
                </div>
                <span className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.badgeClass}`}>
                  {cfg.label}
                </span>
              </div>

              {/* Stock info */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Current stock</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {alert.currentStock} / {alert.minimumRequired} min.
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      alert.severity === 'high'
                        ? 'bg-red-500'
                        : alert.severity === 'medium'
                        ? 'bg-amber-400'
                        : 'bg-blue-400'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {pct}% of minimum required stock available
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
