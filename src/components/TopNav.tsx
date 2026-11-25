import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { EASE_OUT_EXPO } from '../utils/motionVariants';

type SectionId = 'overview' | 'benchmark' | 'analytics' | 'about';

interface NavLinkItem {
  id: SectionId;
  label: string;
  href: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { id: 'overview', label: 'Overview', href: '#overview' },
  { id: 'benchmark', label: 'Benchmark', href: '#benchmark' },
  { id: 'analytics', label: 'Analytics', href: '#analytics' },
  { id: 'about', label: 'About', href: '#about' },
];

export function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const navLockUntilRef = useRef<number>(0);

  useEffect(() => {
    const sections = NAV_LINKS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < navLockUntilRef.current) return;
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const id = visible[0].target.id as SectionId;
          setActiveSection(id);
        }
      },
      {
        rootMargin: '-22% 0px -55% 0px',
        threshold: [0.1, 0.25, 0.5],
      }
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id: SectionId) => {
    navLockUntilRef.current = Date.now() + 750;
    setActiveSection(id);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-4">
        <a
          href="#overview"
          onClick={() => setActiveSection('overview')}
          className="font-display text-base font-semibold tracking-tight text-white transition-colors duration-150 hover:text-[#38BDF8] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] rounded"
        >
          DNS Performance Analyzer
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-8 text-sm font-normal"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.id)}
                aria-current={isActive ? 'location' : undefined}
                className={`relative py-1.5 transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] rounded ${
                  isActive
                    ? 'text-[#38BDF8] font-medium'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="top-nav-underline"
                    transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
                    className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-[#1D7AFC] to-[#38BDF8]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <motion.a
            href="#benchmark"
            onClick={() => handleNavClick('benchmark')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#1D7AFC] px-4 py-2 text-xs font-semibold tracking-wider uppercase text-white transition-all duration-150 hover:bg-[#3B82F6] hover:shadow-[0_0_22px_rgba(59,130,246,0.5)] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]"
          >
            Start Benchmark
          </motion.a>

          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-200 transition-colors hover:bg-white/10 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
            className="overflow-hidden border-t border-white/10 bg-[#050505] md:hidden"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col space-y-2 px-6 py-4">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => handleNavClick(link.id)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1D7AFC]/15 text-[#38BDF8]'
                        : 'text-slate-200 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
              <a
                href="#benchmark"
                onClick={() => handleNavClick('benchmark')}
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-[#1D7AFC] px-4 py-2.5 text-xs font-semibold tracking-wider uppercase text-white transition-colors hover:bg-[#3B82F6]"
              >
                Start Benchmark
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
