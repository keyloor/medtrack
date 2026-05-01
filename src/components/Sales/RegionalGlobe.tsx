import { useEffect, useRef, useState, useMemo } from 'react'
import Globe, { type GlobeMethods } from 'react-globe.gl'
import type { RegionData } from '../../types'

interface Props {
  regions: RegionData[]
  darkMode: boolean
}

const COORDS: Record<string, { lat: number; lng: number }> = {
  'North America': { lat: 39,  lng: -98 },
  'Latin America': { lat: -15, lng: -60 },
  'Europe':        { lat: 51,  lng:  10 },
  'Asia':          { lat: 34,  lng: 105 },
  'Middle East':   { lat: 25,  lng:  45 },
}

interface MarkerData {
  lat: number
  lng: number
  color: string
  region: string
  sales: number
  share: number
}

export default function RegionalGlobe({ regions, darkMode }: Props) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 600, h: 480 })

  const markers: MarkerData[] = useMemo(() => {
    const lastValues = regions.map((r) => r.monthlyData[r.monthlyData.length - 1].sales)
    const total = lastValues.reduce((s, v) => s + v, 0)
    return regions.map((r, i) => ({
      ...COORDS[r.name],
      color: r.color,
      region: r.name,
      sales: lastValues[i],
      share: lastValues[i] / total,
    }))
  }, [regions])

  // Auto-rotate + initial camera position
  useEffect(() => {
    const g = globeRef.current
    if (!g) return
    const controls = g.controls() as { autoRotate: boolean; autoRotateSpeed: number; enableZoom: boolean }
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    controls.enableZoom = false
    g.pointOfView({ lat: 25, lng: -10, altitude: 2.4 }, 0)
  }, [])

  // Responsive sizing
  useEffect(() => {
    if (!containerRef.current) return
    const update = () => {
      const w = containerRef.current!.clientWidth
      setSize({ w, h: Math.min(520, Math.max(380, w * 0.7)) })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const globeImage = darkMode
    ? 'https://unpkg.com/three-globe/example/img/earth-night.jpg'
    : 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'

  const atmosphereColor = darkMode ? '#3b82f6' : '#0ea5e9'

  // Build the floating HTML card for each region
  const buildMarker = (d: object): HTMLElement => {
    const m = d as MarkerData
    const el = document.createElement('div')
    el.style.cssText = `
      pointer-events: auto;
      transform: translate(-50%, -100%);
      font-family: Inter, system-ui, sans-serif;
      cursor: default;
      transition: transform 0.2s ease;
    `
    el.innerHTML = `
      <div style="
        position: relative;
        background: ${darkMode ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.96)'};
        border: 1px solid ${m.color};
        border-radius: 10px;
        padding: 6px 10px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.25), 0 0 0 4px ${m.color}22;
        white-space: nowrap;
        backdrop-filter: blur(6px);
      ">
        <div style="
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          color: ${darkMode ? '#f1f5f9' : '#0f172a'};
          letter-spacing: 0.01em;
        ">
          <span style="
            width: 7px; height: 7px;
            border-radius: 50%;
            background: ${m.color};
            box-shadow: 0 0 8px ${m.color};
          "></span>
          ${m.region}
        </div>
        <div style="
          font-size: 14px;
          font-weight: 700;
          color: ${m.color};
          margin-top: 2px;
          line-height: 1;
        ">
          ${m.sales.toLocaleString()}
          <span style="
            font-size: 10px;
            font-weight: 500;
            color: ${darkMode ? '#94a3b8' : '#64748b'};
            margin-left: 3px;
          ">units · ${(m.share * 100).toFixed(0)}%</span>
        </div>
      </div>
      <div style="
        position: absolute;
        left: 50%; top: 100%;
        transform: translateX(-50%);
        width: 1px; height: 14px;
        background: linear-gradient(to bottom, ${m.color}, transparent);
      "></div>
    `
    return el
  }

  return (
    <div ref={containerRef} className="relative w-full flex justify-center items-center overflow-hidden rounded-xl">
      <Globe
        ref={globeRef}
        width={size.w}
        height={size.h}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl={globeImage}
        atmosphereColor={atmosphereColor}
        atmosphereAltitude={0.18}

        // Pulsing rings at each region — visual indicator of activity
        ringsData={markers}
        ringLat={(d: object) => (d as MarkerData).lat}
        ringLng={(d: object) => (d as MarkerData).lng}
        ringMaxRadius={4}
        ringPropagationSpeed={1.5}
        ringRepeatPeriod={1600}
        ringColor={(d: object) => () => (d as MarkerData).color}
        ringAltitude={0.005}

        // Floating HTML stat-cards above each region
        htmlElementsData={markers}
        htmlLat={(d: object) => (d as MarkerData).lat}
        htmlLng={(d: object) => (d as MarkerData).lng}
        htmlAltitude={0.08}
        htmlElement={buildMarker}
      />
    </div>
  )
}
