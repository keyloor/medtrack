import type { ReactNode } from 'react'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: ReactNode
  accent?: 'blue' | 'violet' | 'red' | 'emerald'
  delay?: number
}

const accentMap = {
  blue:    { icon: 'bg-sky-100 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400',    border: 'border-sky-200 dark:border-sky-500/20',    value: 'text-sky-600 dark:text-sky-400'    },
  violet:  { icon: 'bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-500/20', value: 'text-violet-600 dark:text-violet-400' },
  red:     { icon: 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400',    border: 'border-red-300 dark:border-red-500/40',    value: 'text-red-600 dark:text-red-400'    },
  emerald: { icon: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/20', value: 'text-emerald-600 dark:text-emerald-400' },
}

export default function KPICard({ title, value, subtitle, icon, accent = 'blue', delay = 0 }: KPICardProps) {
  const a = accentMap[accent]

  return (
    <div
      className={`card animate-fade-in-up p-5 flex flex-col gap-4 border ${a.border}`}
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <span className={`flex items-center justify-center w-10 h-10 rounded-xl ${a.icon}`}>
          {icon}
        </span>
      </div>
      <div>
        <p className={`text-3xl font-bold tracking-tight ${a.value}`}>{value}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
