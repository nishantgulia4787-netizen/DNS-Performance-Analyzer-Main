import { motion } from 'motion/react';
import {
  EASE_OUT_EXPO,
  VIEWPORT_ONCE,
  cardGridContainer,
  fadeUpItem,
  sectionReveal,
} from '../utils/motionVariants';

interface IntroCardItem {
  title: string;
  description: string;
  gradientClass: string;
}

const INTRO_CARDS: IntroCardItem[] = [
  {
    title: 'SLOW DNS RESPONSES?',
    description:
      'Discover how long different DNS providers take to resolve your domain names and identify unnecessary delays.',
    gradientClass: 'from-[#050811] via-[#0F499D] to-[#59B5F8]',
  },
  {
    title: 'WHICH DNS IS FASTER?',
    description:
      'Compare Google DNS, Cloudflare and Quad9 through actual network measurements and repeated experiments.',
    gradientClass: 'from-[#070B16] via-[#175DC6] to-[#74C5FF]',
  },
  {
    title: 'DATA BEHIND EVERY RESULT',
    description:
      'Understand response times, reliability, successful queries and performance differences through clear analytics.',
    gradientClass: 'from-[#050811] via-[#0D418E] to-[#4CA8F2]',
  },
];

export function IntroSection() {
  return (
    <section className="bg-[#050505] border-t border-white/15 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="font-display text-2xl font-light leading-snug tracking-tight text-white sm:text-4xl">
            DNS performance doesn&apos;t have to be a mystery.
            <span className="mt-1 block font-semibold text-white">
              Let&apos;s measure what happens behind every website.
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={cardGridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {INTRO_CARDS.map((card) => (
            <motion.article
              key={card.title}
              variants={fadeUpItem}
              whileHover={{
                y: -5,
                transition: { duration: 0.2, ease: EASE_OUT_EXPO },
              }}
              className={`group relative overflow-hidden rounded-[22px] border border-white/25 bg-gradient-to-b ${card.gradientClass} p-8 min-h-[268px] flex flex-col justify-between transition-all duration-200 hover:border-[#38BDF8]/70 hover:shadow-[0_20px_50px_rgba(29,122,252,0.32)]`}
            >
              {/* Subtle dark scrim for text contrast + depth enhancement on hover */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/45 transition-opacity duration-200 group-hover:opacity-85"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-gradient-to-t from-[#38BDF8]/12 via-transparent to-white/5"
              />

              <div className="relative z-10">
                <h3 className="font-display text-sm font-bold uppercase tracking-[0.06em] text-white sm:text-base">
                  {card.title}
                </h3>
                <p className="mt-5 text-sm leading-relaxed text-white/95">
                  {card.description}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
