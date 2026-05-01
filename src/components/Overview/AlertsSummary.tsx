import { AlertTriangle } from 'lucide-react'
import type { Alert, Severity } from '../../types'

interface Props {
  alerts: Alert[]
}

const sev: Record<Severity, { label: string; text: string; bg: string; border: string }> = {
  high:   { label: 'High', text: 'text-red-400',   bg: 'bg-red-500/10',   border: 'border-red-500/20' },
  medium: { label: 'Med',  text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  low:    { label: 'Low',  text: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-600/20' },
}

const order: Record<Severity, number> = { high: 0, medium: 1, low: 2 }

export default function AlertsSummary({ alerts }: Props) {
  const sorted = [...alerts].sort((a, b) => order[a.severity] - order[b.severity])

  return (
    <div className="card p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-white">Active Alerts</h3>
        <span className="text-xs text-slate-400 dark:text-slate-500">{alerts.length} items</span>
      </div>
      <ul className="flex flex-col gap-2 flex-1 overflow-y-auto">
        {sorted.map(alert => {
          const cfg = sev[alert.severity]
          const pct = Math.round((alert.currentStock / alert.minimumRequired) * 100)
          return (
            <li
              key={alert.id}
              className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 border ${cfg.bg} ${cfg.border}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${cfg.text}`} />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
                  {alert.product}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-bold ${cfg.text}`}>{pct}%</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                  {cfg.label}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
