import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import OverviewPanel from './components/Overview/OverviewPanel'
import SalesAnalytics from './components/Sales/SalesAnalytics'
import InventoryTable from './components/Inventory/InventoryTable'
import AlertsPanel from './components/Alerts/AlertsPanel'

import productsRaw from './data/products.json'
import regionsRaw from './data/regions.json'
import alertsRaw from './data/alerts.json'

import type { Product, RegionData, Alert, Tab } from './types'

const products = productsRaw as Product[]
const regions  = regionsRaw  as RegionData[]
const alerts   = alertsRaw   as Alert[]

function getInitialDark(): boolean {
  const stored = localStorage.getItem('medtrack-dark')
  if (stored !== null) return stored === 'true'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(getInitialDark)
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('medtrack-dark', String(darkMode))
  }, [darkMode])

  const toggleDark = () => setDarkMode((d) => !d)

  const handleSetTab = (tab: Tab) => {
    setActiveTab(tab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
      <Header
        darkMode={darkMode}
        toggleDark={toggleDark}
        activeTab={activeTab}
        setActiveTab={handleSetTab}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewPanel products={products} alerts={alerts} regions={regions} />
        )}
        {activeTab === 'sales' && (
          <SalesAnalytics products={products} regions={regions} darkMode={darkMode} />
        )}
        {activeTab === 'inventory' && (
          <InventoryTable products={products} />
        )}
        {activeTab === 'alerts' && (
          <AlertsPanel alerts={alerts} />
        )}
      </main>

      <Footer />
    </div>
  )
}
