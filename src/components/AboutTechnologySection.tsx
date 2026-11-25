import { Activity, BarChart2, Globe2 } from 'lucide-react';
import { motion } from 'motion/react';
import {
  EASE_OUT_EXPO,
  VIEWPORT_ONCE,
  cardGridContainer,
  fadeUpItem,
  sectionReveal,
} from '../utils/motionVariants';

const TECH_CARDS = [
  {
    title: 'DNS Resolution',
    description:
      'Translates human-readable domain names into IPv4 addresses by dispatching UDP queries to recursive anycast resolvers.',
    Icon: Globe2,
  },
  {
    title: 'Network Measurement',
    description:
      'Captures high-precision round-trip latency across repeated test iterations while recording timeouts and resolution failures.',
    Icon: Activity,
  },
  {
    title: 'Performance Analytics',
    description:
      'Aggregates minimum, average, and maximum response times alongside query success rates for side-by-side provider comparison.',
    Icon: BarChart2,
  },
];

export function AboutTechnologySection() {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-t border-white/15 bg-[#050505] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="max-w-2xl"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#38BDF8]">
            ARCHITECTURE & METHODOLOGY
          </p>
          <h2 className="font-display mt-3 text-3xl font-light tracking-tight text-white sm:text-4xl">
            Behind every <span className="font-semibold">millisecond.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={cardGridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {TECH_CARDS.map((item) => {
            const Icon = item.Icon;
            return (
              <motion.article
                key={item.title}
                variants={fadeUpItem}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.2, ease: EASE_OUT_EXPO },
                }}
                className="rounded-2xl border border-white/12 bg-gradient-to-b from-[#0C1426]/80 to-[#060911] p-7 transition-all duration-200 hover:border-[#38BDF8]/50 hover:shadow-[0_14px_38px_rgba(29,122,252,0.18)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#38BDF8]/25 bg-[#3B82F6]/12 text-[#38BDF8]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-display mt-5 text-base font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                  {item.description}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
