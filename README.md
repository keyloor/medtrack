# MedTrack — Healthcare Inventory Intelligence

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20Dashboard-000000?style=for-the-badge&logo=vercel)](https://medproducts-tracker.vercel.app/)

> A polished, fully responsive healthcare inventory and sales analytics dashboard built with React, TypeScript, and Tailwind CSS.

MedTrack is a production-shaped reference app for a common medical operations workflow: **giving healthcare teams a clear real-time view of product stock levels, regional sales performance, and inventory alerts.** Explore the dashboard to view computed KPI metrics, interactive charts, a fully sortable inventory table, and severity-sorted alert cards — all in a sleek, responsive UI with light and dark modes.

---

## Highlights

- **Overview Panel built for skim-reading**: 4 KPI cards including total products, units sold this month, active alert count (turns red when > 5), and top-performing region. Values computed live from local JSON data.
- **Sales Analytics** with interactive Recharts: a line chart showing a 12-month sales trend across 5 global regions, and a responsive bar chart of units sold by medical product category.
- **Inventory Table** featuring all medical products with live search functionality, dropdown filters (category and region), and automatically computed status badges (In Stock, Low Stock, Critical).
- **Alerts Panel** rendering active inventory alerts, sorted automatically by severity. Features custom stock progress bars and severity badges.
- **Dark, enterprise UI** with a built-in light / dark mode toggle that persists to `localStorage` and respects system preferences. Tailwind tokens: `#0f172a` background, `#1e293b` cards.
- **Subtle fade-in-up animations** with staggered delays for a polished, modern feel on every section and card.
- **Zero-backend architecture** — fully static React SPA querying local JSON. No API keys, no servers, just pure frontend logic.

## Tech stack

**Frontend**<br>
![React](https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=react&logoColor=white)

**Deployment**<br>
![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

## Project layout

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
│   │   ├── products.json             # 20 medical products (Cardio, Ortho, Surgical)
│   │   ├── regions.json              # 5 regions × 12 months (May 2025 - Apr 2026)
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

## Quick start

> **TL;DR** — clone, install, and run. It's a static React SPA powered by Vite, so no backend setup is required.

### 1. Install & Run

```bash
# Clone the repository
git clone https://github.com/keylo/medtrack.git
cd medtrack

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open <http://localhost:5173> to view the app.

### 2. Build for Production

```bash
npm run build
npm run preview
```

Output is written to `dist/` and is ready to serve as a static site.

## Mock Data Overview

The app relies on static JSON files located in `src/data/` to simulate an active database:

| File | Content | Notes |
|---|---|---|
| `products.json` | 20 medical products | Three categories: Cardiovascular, Orthopedic, Surgical. Features `id`, `name`, `category`, `stock`, `unitsSoldThisMonth`, `region`. |
| `regions.json` | Regional sales trends | Five global regions (North America, Europe, Asia, Latin America, Middle East) with 12 months of sales data. |
| `alerts.json` | Inventory alerts | Ten active alerts featuring `severity` (high / medium / low), `currentStock`, and `minimumRequired`. |

## End-to-end workflow

1. **Dashboard Overview** — At a glance, review KPI cards that aggregate totals across the mock database.
2. **Sales Review** — Switch to the Sales Analytics view to analyze historical trends and category-specific volume.
3. **Inventory Management** — Open the Inventory view to filter by region or category, search for specific equipment, and spot critically low stock via automatically mapped status badges.
4. **Alerts Resolution** — View the prioritized Alerts Panel. High severity alerts are surfaced first, giving an operation manager an immediate action list.
5. **Dark Mode toggle** — Click the sun/moon icon in the header seamlessly.

## Deployment (Vercel)

This project is configured out-of-the-box for [Vercel](https://vercel.com/) with a built-in `vercel.json` SPA rewrite rule.

```bash
npm i -g vercel
vercel
```
Alternatively, connect the GitHub repository in the Vercel dashboard and let Vercel auto-detect the Vite build.

## Roadmap ideas

These aren't built — they're natural next moves if you want to extend the project:

- Connect to a real database (e.g. Supabase, Firebase, or a custom backend)
- Add user authentication and role-based access for viewing hospital stock
- Export reports as PDF or CSV directly from the table views
- Real-time WebSockets to update stock numbers dynamically

## License

MIT — do whatever you want.
