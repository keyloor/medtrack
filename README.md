# MedTrack — Healthcare Inventory Intelligence

A modern, fully responsive healthcare inventory and sales analytics dashboard built with React, TypeScript, and Tailwind CSS. MedTrack gives medical operations teams a clear real-time view of product stock levels, regional sales performance, and inventory alerts — all from a single-page application with zero backend required.

---

## Screenshot

> Overview · Sales Analytics · Inventory · Alerts

| Dark Mode | Light Mode |
|-----------|------------|
| KPI cards, charts, searchable table, and severity-sorted alert cards | Same layout with light theme |

---

## Features

### Overview Panel
- **4 KPI cards** — Total products, units sold this month, active alert count (turns red when > 5), and top-performing region
- Values are computed live from the mock JSON data

### Sales Analytics
- **Line chart** — Monthly sales trend across all 5 regions for the last 12 months (May 2025 – Apr 2026)
- **Bar chart** — Units sold by product category (cardiovascular, orthopedic, surgical) for the current month
- Both charts are fully responsive via Recharts + ResizableContainer

### Inventory Table
- All 20 medical products in a clean, sortable-friendly table
- **Live search** by product name
- **Dropdown filters** by category and region
- **Status badges** — In Stock (green), Low Stock (yellow), Critical (red) — computed from current stock levels

### Alerts Panel
- Cards for each of the 10 active inventory alerts
- **Severity badges** — High, Medium, Low
- **Stock progress bar** showing current vs. minimum required stock percentage
- Sorted by severity (high → medium → low) with a summary chip row at the top

### UX & Design
- **Light / Dark mode** toggle — persists to `localStorage` and respects the OS `prefers-color-scheme` on first visit
- Dark theme: `#0f172a` background, `#1e293b` cards
- Subtle **fade-in-up animations** with staggered delays on every section and card
- Sticky header with tab navigation
- Custom styled scrollbar
- Fully responsive from mobile to widescreen

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build tool | [Vite 5](https://vitejs.dev/) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com/) (dark mode via `class` strategy) |
| Charts | [Recharts 2](https://recharts.org/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Data | Static JSON files — no backend, no API keys |
| Deployment | [Vercel](https://vercel.com/) (config included) |

---

## Project Structure

```
medtrack/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Alerts/
│   │   │   └── AlertsPanel.tsx       # Alert cards sorted by severity
│   │   ├── Inventory/
│   │   │   └── InventoryTable.tsx    # Searchable, filterable product table
│   │   ├── Overview/
│   │   │   ├── KPICard.tsx           # Reusable KPI card with accent variants
│   │   │   └── OverviewPanel.tsx     # 4-card overview grid
│   │   ├── Sales/
│   │   │   └── SalesAnalytics.tsx    # Line + bar charts with Recharts
│   │   ├── Header.tsx                # Sticky header, tabs, dark toggle
│   │   └── Footer.tsx
│   ├── data/
│   │   ├── products.json             # 20 medical products
│   │   ├── regions.json              # 5 regions × 12 months of sales data
│   │   └── alerts.json               # 10 inventory alerts
│   ├── types/
│   │   └── index.ts                  # Shared TypeScript interfaces
│   ├── App.tsx                       # Root — tab routing + dark mode state
│   ├── main.tsx
│   └── index.css                     # Tailwind directives + custom utilities
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── vercel.json                       # Vercel SPA rewrite rule
```

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Install & Run

```bash
# Clone the repository
git clone https://github.com/keylo/medtrack.git
cd medtrack

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Output is written to `dist/` and is ready to serve as a static site.

### Preview the Production Build

```bash
npm run preview
```

---

## Deployment (Vercel)

This project includes a `vercel.json` with SPA rewrite rules. To deploy:

**Option 1 — Vercel CLI:**
```bash
npm i -g vercel
vercel
```

**Option 2 — GitHub Integration:**
1. Push this repository to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Vite — no extra configuration needed

---

## Mock Data Overview

### `products.json`
20 medical products across three categories:
- **Cardiovascular** — CardioStent Pro, HeartValve Ultra, AortaGraft Plus, and more
- **Orthopedic** — TitaniumKnee 3D, SpineAlign Pro, BoneScrew Flex, and more
- **Surgical** — LapraScalpel Neo, SurgiThread Pro, EndoScope 4K, and more

Each product has: `id`, `name`, `category`, `stock`, `unitsSoldThisMonth`, `region`

### `regions.json`
Five global regions with 12 months of monthly sales figures (May 2025 – Apr 2026):
North America · Europe · Asia · Latin America · Middle East

### `alerts.json`
Ten inventory alerts with `severity` (high / medium / low), `currentStock`, and `minimumRequired`.

---

## Author

Built by **Keylor Barrantes**

---

## License

MIT
