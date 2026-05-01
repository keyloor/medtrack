import { Sun, Moon, Activity } from 'lucide-react'
import type { Tab } from '../types'

interface HeaderProps {
  darkMode: boolean
  toggleDark: () => void
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'overview',   label: 'Overview'   },
  { id: 'sales',      label: 'Sales Analytics' },
  { id: 'inventory',  label: 'Inventory'  },
  { id: 'alerts',     label: 'Alerts'     },
]

export default function Header({ darkMode, toggleDark, activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row: logo + toggle */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-sky-500 shadow-lg shadow-sky-500/30">
              <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                MedTrack
              </span>
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 leading-tight hidden sm:block">
                Healthcare Inventory Intelligence
              </p>
            </div>
          </div>

          <button
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation tabs */}
        <nav className="flex gap-1 -mb-px overflow-x-auto scrollbar-none pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-sky-50/60 dark:bg-sky-500/10'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
