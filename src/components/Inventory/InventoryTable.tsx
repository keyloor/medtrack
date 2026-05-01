import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import type { Product, Category, Region } from '../../types'

interface Props {
  products: Product[]
}

type StockStatus = 'In Stock' | 'Low Stock' | 'Critical'

function getStatus(stock: number): StockStatus {
  if (stock < 10) return 'Critical'
  if (stock < 25) return 'Low Stock'
  return 'In Stock'
}

const statusStyles: Record<StockStatus, string> = {
  'In Stock':  'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  'Low Stock': 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  'Critical':  'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
}

const categoryStyles: Record<Category, string> = {
  cardiovascular: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400',
  orthopedic:     'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400',
  surgical:       'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400',
}

const ALL = 'All'

const categories: (Category | typeof ALL)[] = [ALL, 'cardiovascular', 'orthopedic', 'surgical']
const regions: (Region | typeof ALL)[] = [ALL, 'North America', 'Latin America', 'Europe', 'Asia', 'Middle East']

export default function InventoryTable({ products }: Props) {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<Category | typeof ALL>(ALL)
  const [regionFilter, setRegionFilter] = useState<Region | typeof ALL>(ALL)

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchCat    = catFilter === ALL || p.category === catFilter
      const matchRegion = regionFilter === ALL || p.region === regionFilter
      return matchSearch && matchCat && matchRegion
    })
  }, [products, search, catFilter, regionFilter])

  return (
    <section className="animate-fade-in" style={{ animationDelay: '0ms' }}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Inventory</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
          {filtered.length} of {products.length} products
        </p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-4 flex flex-col sm:flex-row gap-3 animate-fade-in-up" style={{ animationDelay: '40ms', opacity: 0 }}>
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500"
          />
        </div>

        {/* Category filter */}
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value as Category | typeof ALL)}
          className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === ALL ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>

        {/* Region filter */}
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value as Region | typeof ALL)}
          className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
        >
          {regions.map((r) => (
            <option key={r} value={r}>
              {r === ALL ? 'All Regions' : r}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden animate-fade-in-up" style={{ animationDelay: '100ms', opacity: 0 }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/80 dark:bg-slate-800/40">
                <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Product</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Category</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Region</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Stock</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Sold / Mo</th>
                <th className="text-center px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 dark:text-slate-500">
                    No products match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => {
                  const status = getStatus(p.stock)
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-slate-100 dark:border-slate-700/40 last:border-0 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                      style={{ animationDelay: `${i * 25}ms` }}
                    >
                      <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {p.name}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium capitalize ${categoryStyles[p.category]}`}>
                          {p.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {p.region}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-slate-700 dark:text-slate-300">
                        {p.stock.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-slate-700 dark:text-slate-300">
                        {p.unitsSoldThisMonth.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
