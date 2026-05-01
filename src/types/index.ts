export type Category = 'cardiovascular' | 'orthopedic' | 'surgical'
export type Region = 'North America' | 'Latin America' | 'Europe' | 'Asia' | 'Middle East'
export type Severity = 'high' | 'medium' | 'low'

export interface Product {
  id: number
  name: string
  category: Category
  stock: number
  unitsSoldThisMonth: number
  region: Region
}

export interface MonthlyDataPoint {
  month: string
  sales: number
}

export interface RegionData {
  id: number
  name: string
  color: string
  monthlyData: MonthlyDataPoint[]
}

export interface Alert {
  id: number
  product: string
  severity: Severity
  currentStock: number
  minimumRequired: number
}

export type Tab = 'overview' | 'sales' | 'inventory' | 'alerts'
