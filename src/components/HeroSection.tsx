import { ArrowRight, Laptop, Server, ShieldCheck } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import {
  EASE_OUT_EXPO,
  fadeUpItem,
  heroStaggerContainer,
} from '../utils/motionVariants';

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="overview"
      className="relative scroll-mt-20 overflow-hidden bg-[#050505] pt-8 pb-20 lg:pt-12 lg:pb-24"
    >
      {/* Atmospheric sky-blue / electric-blue hero wash matching reference */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[430px]"
        style={{
          background:
            'radial-gradient(ellipse 85% 75% at 22% 0%, rgba(125, 200, 255, 0.58) 0%, rgba(37, 118, 235, 0.34) 45%, rgba(5, 5, 5, 0) 82%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {/* Left Side: Chamfered Blue Gradient Glassmorphism Panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            className="lg:col-span-6 flex"
          >
            <div className="w-full rounded-3xl hero-chamfer-clip bg-gradient-to-br from-white/35 via-white/20 to-white/10 p-[1px] shadow-[0_24px_80px_rgba(29,122,252,0.22)]">
              <div className="relative h-full w-full overflow-hidden rounded-[23px] hero-chamfer-clip bg-gradient-to-br from-[#3585E8]/55 via-[#144496]/75 to-[#060C1A]/95 p-8 sm:p-11 lg:p-12 backdrop-blur-xl flex flex-col justify-between min-h-[420px] lg:min-h-[470px]">
                {/* Subtle ambient glow sheen inside the hero glass card */}
                {!prefersReducedMotion && (
                  <motion.div
                    aria-hidden="true"
                    initial={{ opacity: 0.25 }}
                    animate={{ opacity: [0.22, 0.45, 0.22] }}
                    transition={{
                      duration: 5.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-[#7DC8FF]/25 blur-3xl"
                  />
                )}

                <motion.div
                  variants={heroStaggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="relative z-10"
                >
                  <motion.p
                    variants={fadeUpItem}
                    className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/85"
                  >
                    NETWORK INTELLIGENCE / DNS LAB
                  </motion.p>

                  <h1 className="font-display mt-8 text-4xl font-light leading-[1.12] tracking-tight text-white sm:text-5xl xl:text-[54px]">
                    <motion.span variants={fadeUpItem} className="block">
                      Your Internet.
                    </motion.span>
                    <motion.span variants={fadeUpItem} className="block">
                      Starts With{' '}
                      <motion.span
                        className="font-semibold text-[#38BDF8] inline-block"
                        animate={
                          prefersReducedMotion
                            ? undefined
                            : {
                                textShadow: [
                                  '0 0 12px rgba(56,189,248,0.25)',
                                  '0 0 24px rgba(56,189,248,0.6)',
                                  '0 0 12px rgba(56,189,248,0.25)',
                                ],
                              }
                        }
                        transition={{
                          duration: 3.6,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        DNS.
                      </motion.span>
                    </motion.span>
                  </h1>

                  <motion.p
                    variants={fadeUpItem}
                    className="mt-6 max-w-md text-sm leading-relaxed text-slate-200/90 sm:text-base"
                  >
                    Measure, compare and understand how DNS providers resolve the websites you visit.
                  </motion.p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.28, ease: EASE_OUT_EXPO }}
                  className="relative z-10 mt-10 flex flex-wrap items-center gap-3.5"
                >
                  <motion.a
                    href="#benchmark"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1D7AFC] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all duration-150 hover:bg-[#3B82F6] hover:shadow-[0_0_24px_rgba(59,130,246,0.55)] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]"
                  >
                    <span>Start Benchmark</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </motion.a>
                  <motion.a
                    href="#analytics"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/8 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-150 hover:border-[#38BDF8]/60 hover:bg-white/14 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]"
                  >
                    Explore Analytics
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Cinematic Blue-Toned DNS Resolution Topology Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: EASE_OUT_EXPO }}
            className="lg:col-span-6 flex"
          >
            <div className="relative w-full overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#0C1426] via-[#070B14] to-[#05070C] p-6 sm:p-8 flex flex-col justify-between min-h-[420px] lg:min-h-[470px] shadow-[0_24px_70px_rgba(0,0,0,0.75)]">
              {/* Subtle radial glow inside visual frame */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-[#3B82F6]/15 blur-3xl"
              />

              <div className="relative flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#38BDF8]">
                    DNS Resolution Path
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-white">
                    Recursive A-Record Query Dispatch
                  </p>
                </div>
                <span className="font-mono text-xs text-slate-400 tabular-nums whitespace-nowrap">
                  UDP / Port 53
                </span>
              </div>

              {/* Technical Topology Diagram */}
              <div className="relative my-auto py-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-12 sm:items-center">
                  {/* Client Device Node */}
                  <div className="sm:col-span-5">
                    <div className="rounded-2xl border border-[#38BDF8]/35 bg-[#0D1A33]/85 p-4 backdrop-blur-md">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3B82F6]/20 text-[#38BDF8] border border-[#3B82F6]/30">
                          <Laptop className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white">
                            Client Device
                          </p>
                          <p className="font-mono text-[11px] text-slate-400">
                            Stub Resolver
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 border-t border-white/10 pt-2.5 flex items-center justify-between gap-3 font-mono text-[11px] text-slate-300">
                        <span className="shrink-0 text-slate-400">Query</span>
                        <span className="text-[#38BDF8] truncate">A · example.com</span>
                      </div>
                    </div>
                  </div>

                  {/* Connecting Network Paths SVG */}
                  <div className="hidden sm:flex sm:col-span-2 items-center justify-center">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 140 200"
                      className="h-48 w-full overflow-visible"
                    >
                      <defs>
                        <linearGradient id="dnsPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#1D7AFC" stopOpacity="0.95" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 4 100 C 55 100, 75 30, 136 30"
                        fill="none"
                        stroke="url(#dnsPathGrad)"
                        strokeWidth="1.75"
                        strokeDasharray="4 4"
                      />
                      <path
                        d="M 4 100 L 136 100"
                        fill="none"
                        stroke="#22D3EE"
                        strokeWidth="2"
                      />
                      <path
                        d="M 4 100 C 55 100, 75 170, 136 170"
                        fill="none"
                        stroke="url(#dnsPathGrad)"
                        strokeWidth="1.75"
                        strokeDasharray="4 4"
                      />
                      <circle cx="4" cy="100" r="4" fill="#38BDF8" />
                      <circle cx="136" cy="30" r="3.5" fill="#3B82F6" />
                      <circle cx="136" cy="100" r="4" fill="#22D3EE" />
                      <circle cx="136" cy="170" r="3.5" fill="#3B82F6" />
                    </svg>
                  </div>

                  {/* Resolver Nodes */}
                  <div className="sm:col-span-5 space-y-3">
                    <div className="flex items-center justify-between rounded-xl border border-white/12 bg-[#0B1426]/90 px-4 py-3 transition-colors duration-150 hover:border-[#3B82F6]/50">
                      <div className="flex items-center gap-3">
                        <Server className="h-4 w-4 text-[#3B82F6] shrink-0" aria-hidden="true" />
                        <div>
                          <p className="text-xs font-semibold text-white">Google DNS</p>
                          <p className="font-mono text-[11px] text-[#38BDF8] tabular-nums">
                            8.8.8.8
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-slate-300 tabular-nums">
                        Anycast
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-[#22D3EE]/35 bg-[#0E1E38]/95 px-4 py-3 shadow-[0_0_24px_rgba(34,211,238,0.12)] transition-colors duration-150 hover:border-[#22D3EE]/60">
                      <div className="flex items-center gap-3">
                        <Server className="h-4 w-4 text-[#22D3EE] shrink-0" aria-hidden="true" />
                        <div>
                          <p className="text-xs font-semibold text-white">Cloudflare DNS</p>
                          <p className="font-mono text-[11px] text-[#22D3EE] tabular-nums">
                            1.1.1.1
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-[#22D3EE] tabular-nums">
                        Anycast
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-white/12 bg-[#0B1426]/90 px-4 py-3 transition-colors duration-150 hover:border-[#3B82F6]/50">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="h-4 w-4 text-[#3B82F6] shrink-0" aria-hidden="true" />
                        <div>
                          <p className="text-xs font-semibold text-white">Quad9 DNS</p>
                          <p className="font-mono text-[11px] text-[#38BDF8] tabular-nums">
                            9.9.9.9
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-slate-300 tabular-nums">
                        Anycast
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4 text-xs text-slate-400">
                <span>Sequential RTT Measurement</span>
                <span className="font-mono text-slate-300">
                  3 Global Anycast Resolvers
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
