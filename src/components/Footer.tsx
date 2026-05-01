export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-sm text-slate-400 dark:text-slate-500">
          Built by{' '}
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            Keylor Barrantes
          </span>
        </p>
        <p className="text-xs text-slate-300 dark:text-slate-600">
          MedTrack &copy; {new Date().getFullYear()} — Healthcare Inventory Intelligence
        </p>
      </div>
    </footer>
  )
}
