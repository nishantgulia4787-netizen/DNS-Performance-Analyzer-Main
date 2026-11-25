export function Footer() {
  return (
    <footer className="border-t border-white/15 bg-[#050505] py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-white">
              DNS PERFORMANCE ANALYZER
            </p>
            <p className="mt-1.5 text-sm text-slate-400">
              Understanding the speed behind every connection.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-6 text-sm text-slate-400"
          >
            <a
              href="#overview"
              className="transition-colors duration-150 hover:text-white whitespace-nowrap"
            >
              Overview
            </a>
            <a
              href="#benchmark"
              className="transition-colors duration-150 hover:text-white whitespace-nowrap"
            >
              Benchmark
            </a>
            <a
              href="#analytics"
              className="transition-colors duration-150 hover:text-white whitespace-nowrap"
            >
              Analytics
            </a>
            <a
              href="#about"
              className="transition-colors duration-150 hover:text-white whitespace-nowrap"
            >
              About
            </a>
          </nav>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
            COMPUTER NETWORKS PROJECT | 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
