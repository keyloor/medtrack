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

const TABS: Tab[] = ['overview', 'sales', 'inventory', 'alerts']

function getInitialDark(): boolean {
  try {
    return localStorage.getItem('medtrack-dark') === 'true'
  } catch {
    return false
  }
}

function getInitialTab(): Tab {
  const hash = window.location.hash.slice(1) as Tab
  return TABS.includes(hash) ? hash : 'overview'
}

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(getInitialDark)
  const [activeTab, setActiveTab] = useState<Tab>(getInitialTab)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    try {
      localStorage.setItem('medtrack-dark', String(darkMode))
    } catch {
      // storage unavailable (private mode)
    }
  }, [darkMode])

  useEffect(() => {
    const onHash = () => setActiveTab(getInitialTab())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const toggleDark = () => setDarkMode((d) => !d)

  const handleSetTab = (tab: Tab) => {
    setActiveTab(tab)
    window.history.replaceState(null, '', `#${tab}`)
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
