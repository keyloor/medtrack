import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
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

function escapeHtml(v: string): string {
  return v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

const HOME_VIEW = { lat: 25, lng: -10, altitude: 2.4 }

export default function RegionalGlobe({ regions, darkMode }: Props) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 600, h: 480 })
  const [ready, setReady] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const hoveringRef = useRef(false)
  const cardsRef = useRef(new Map<string, { box: HTMLElement; color: string }>())
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  const markers: MarkerData[] = useMemo(() => {
    const known = regions.filter((r) => COORDS[r.name] && r.monthlyData.length > 0)
    const lastValues = known.map((r) => r.monthlyData[r.monthlyData.length - 1].sales)
    const total = lastValues.reduce((s, v) => s + v, 0) || 1
    return known.map((r, i) => ({
      ...COORDS[r.name],
      color: r.color,
      region: r.name,
      sales: lastValues[i],
      share: lastValues[i] / total,
    }))
  }, [regions])

  const setAutoRotate = (on: boolean) => {
    const controls = globeRef.current?.controls() as { autoRotate: boolean } | undefined
    if (controls) controls.autoRotate = on && !reducedMotion
  }

  // One-time setup once the WebGL globe is actually ready
  const handleReady = () => {
    const g = globeRef.current
    if (!g) return
    const controls = g.controls() as { autoRotate: boolean; autoRotateSpeed: number; enableZoom: boolean }
    controls.autoRotateSpeed = 0.5
    controls.enableZoom = false
    controls.autoRotate = !reducedMotion
    g.renderer().setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    g.pointOfView(HOME_VIEW, 0)
    setReady(true)
  }

  // Pause rendering entirely while the globe is off-screen or the tab is hidden
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let visible = true
    const apply = () => {
      const g = globeRef.current
      if (!g) return
      if (visible && !document.hidden) g.resumeAnimation()
      else g.pauseAnimation()
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      apply()
    })
    io.observe(el)
    document.addEventListener('visibilitychange', apply)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', apply)
    }
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

  const focusRegion = (m: MarkerData) => {
    const g = globeRef.current
    if (!g) return
    if (selected === m.region) {
      setSelected(null)
      g.pointOfView(HOME_VIEW, 900)
      setAutoRotate(!hoveringRef.current)
      return
    }
    setSelected(m.region)
    setAutoRotate(false)
    g.pointOfView({ lat: m.lat, lng: m.lng, altitude: 1.7 }, 900)
  }

  const focusRef = useRef(focusRegion)
  focusRef.current = focusRegion

  useEffect(() => {
    cardsRef.current.forEach(({ box, color }, region) => {
      const on = region === selected
      box.style.boxShadow = `0 4px 14px rgba(0,0,0,0.25), 0 0 0 ${on ? 6 : 4}px ${color}${on ? '55' : '22'}`
    })
  }, [selected, markers])

  const globeImage = darkMode
    ? 'https://unpkg.com/three-globe/example/img/earth-night.jpg'
    : 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'

  const atmosphereColor = darkMode ? '#3b82f6' : '#0ea5e9'

  // Build the floating HTML card for each region
  const buildMarker = useCallback((d: object): HTMLElement => {
    const m = d as MarkerData
    const el = document.createElement('div')
    el.style.cssText = `
      position: relative;
      pointer-events: none;
      transform: translate(-50%, -100%);
      padding-bottom: 22px;
      font-family: Inter, system-ui, sans-serif;
      cursor: pointer;
      transition: opacity 0.25s ease;
    `
    el.innerHTML = `
      <div style="
        pointer-events: auto;
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
          ${escapeHtml(m.region)}
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
    `
    const box = el.firstElementChild as HTMLElement
    box.title = `${m.region}: click to focus`
    box.style.cursor = 'pointer'
    box.addEventListener('click', () => focusRef.current(m))
    cardsRef.current.set(m.region, { box, color: m.color })
    return el
  }, [darkMode])

  return (
    <div
      ref={containerRef}
      className="relative w-full flex justify-center items-center overflow-hidden rounded-xl"
      onMouseEnter={() => { hoveringRef.current = true; setAutoRotate(false) }}
      onMouseLeave={() => { hoveringRef.current = false; if (!selected) setAutoRotate(true) }}
    >
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400 dark:text-slate-500">
          Loading globe…
        </div>
      )}
      <Globe
        key={darkMode ? 'dark' : 'light'}
        ref={globeRef}
        onGlobeReady={handleReady}
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
        htmlAltitude={0.005}
        htmlElement={buildMarker}
        // Hide cards on the far side of the planet instead of showing through it
        htmlElementVisibilityModifier={(el: HTMLElement, isVisible: boolean) => {
          el.style.opacity = isVisible ? '1' : '0'
          el.style.pointerEvents = isVisible ? 'auto' : 'none'
        }}
      />
    </div>
  )
}
