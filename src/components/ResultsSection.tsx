import { Download } from 'lucide-react';
import { motion } from 'motion/react';
import type { BenchmarkExperiment } from '../types/dns';
import {
  computeExperimentAverageLatency,
  findFastestProvider,
} from '../utils/dnsMetrics';
import {
  EASE_OUT_EXPO,
  cardGridContainer,
  fadeUpItem,
} from '../utils/motionVariants';
import { AnimatedMetricValue } from './AnimatedMetricValue';

interface ResultsSectionProps {
  experiment: BenchmarkExperiment;
  onExportCsv: (experiment: BenchmarkExperiment) => void;
}

export function ResultsSection({
  experiment,
  onExportCsv,
}: ResultsSectionProps) {
  const fastest = findFastestProvider(experiment.providerResults);
  const avgLatency = computeExperimentAverageLatency(experiment);

  const totalQueries = experiment.providerResults.reduce(
    (sum, r) => sum + r.totalQueries,
    0
  );
  const successfulQueries = experiment.providerResults.reduce(
    (sum, r) => sum + r.successfulQueries,
    0
  );
  const successRate =
    totalQueries > 0
      ? Number(((successfulQueries / totalQueries) * 100).toFixed(1))
      : 0;

  return (
    <motion.section
      id="results"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
      className="scroll-mt-20 border-t border-white/15 bg-[#050505] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 space-y-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#38BDF8]">
              BENCHMARK OUTPUT ·{' '}
              {experiment.dataOrigin === 'live'
                ? 'LIVE FASTAPI MEASUREMENT'
                : 'SAMPLE DATA PREVIEW'}
            </p>
            <h2 className="font-display mt-3 text-3xl font-light tracking-tight text-white sm:text-4xl">
              Your network. <span className="font-semibold">Your results.</span>
            </h2>
            <p className="mt-2 text-sm text-slate-400 tabular-nums">
              Target domain: <span className="font-mono text-slate-200">{experiment.domain}</span>
              <span className="mx-2 text-slate-600" aria-hidden="true">·</span>
              Query type: <span className="text-slate-200">{experiment.queryType} Record (IPv4)</span>
            </p>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onExportCsv(experiment)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-medium text-slate-200 transition-colors hover:border-[#38BDF8]/60 hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Export Results CSV</span>
          </motion.button>
        </div>

        {experiment.dataOrigin === 'sample' && (
          <div
            role="status"
            className="rounded-xl border border-[#38BDF8]/30 bg-[#0A1830]/60 px-4 py-3 text-xs text-slate-200"
          >
            <strong className="font-semibold text-[#38BDF8]">Sample Data Preview:</strong>{' '}
            These figures are isolated prototype mock data for layout preview and do not represent a live DNS test on your network.
          </div>
        )}

        {/* Four Prominent Metrics with Staggered Reveal & Count-Up */}
        <motion.div
          variants={cardGridContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div
            variants={fadeUpItem}
            className="rounded-2xl border border-white/12 bg-[#0A0F1A] p-6"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
              Average DNS Latency
            </p>
            <p className="font-display mt-3 text-3xl font-semibold text-white tabular-nums">
              <AnimatedMetricValue value={avgLatency} decimals={1} />{' '}
              <span className="text-base font-normal text-slate-400">ms</span>
            </p>
          </motion.div>

          <motion.div
            variants={fadeUpItem}
            className="rounded-2xl border border-[#22C55E]/30 bg-[#0A1412]/80 p-6"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#22C55E]">
              Fastest DNS Provider
            </p>
            <p className="font-display mt-3 text-2xl font-semibold text-white truncate">
              {fastest ? fastest.providerName : '—'}
            </p>
            {fastest && (
              <p className="mt-1 font-mono text-xs text-[#22C55E] tabular-nums">
                <AnimatedMetricValue value={fastest.avgLatencyMs} decimals={2} /> ms ·{' '}
                {fastest.dnsServer}
              </p>
            )}
          </motion.div>

          <motion.div
            variants={fadeUpItem}
            className="rounded-2xl border border-white/12 bg-[#0A0F1A] p-6"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
              Successful Queries
            </p>
            <p className="font-display mt-3 text-3xl font-semibold text-white tabular-nums">
              <AnimatedMetricValue value={successfulQueries} decimals={0} />{' '}
              <span className="text-base font-normal text-slate-400">
                / {totalQueries}
              </span>
            </p>
          </motion.div>

          <motion.div
            variants={fadeUpItem}
            className="rounded-2xl border border-white/12 bg-[#0A0F1A] p-6"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
              Query Success Rate
            </p>
            <p className="font-display mt-3 text-3xl font-semibold text-[#38BDF8] tabular-nums">
              <AnimatedMetricValue value={successRate} decimals={1} />%
            </p>
          </motion.div>
        </motion.div>

        {/* Clean 6-Column Results Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.14, ease: EASE_OUT_EXPO }}
          className="overflow-hidden rounded-2xl border border-white/12 bg-[#0A0F1A]"
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  <th scope="col" className="px-6 py-4 whitespace-nowrap">
                    Provider
                  </th>
                  <th scope="col" className="px-6 py-4 whitespace-nowrap">
                    DNS Server
                  </th>
                  <th scope="col" className="px-6 py-4 text-right whitespace-nowrap">
                    Average Latency
                  </th>
                  <th scope="col" className="px-6 py-4 text-right whitespace-nowrap">
                    Minimum Latency
                  </th>
                  <th scope="col" className="px-6 py-4 text-right whitespace-nowrap">
                    Maximum Latency
                  </th>
                  <th scope="col" className="px-6 py-4 text-right whitespace-nowrap">
                    Success Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {experiment.providerResults.map((row) => {
                  const isFastest = fastest?.providerId === row.providerId;
                  return (
                    <tr
                      key={row.providerId}
                      className={`transition-colors duration-150 ${
                        isFastest
                          ? 'bg-[#22C55E]/[0.07] hover:bg-[#22C55E]/[0.11]'
                          : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                        <span>{row.providerName}</span>
                        {isFastest && (
                          <span className="ml-2.5 text-xs font-semibold text-[#22C55E]">
                            Fastest
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-[#38BDF8] tabular-nums whitespace-nowrap">
                        {row.dnsServer}
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-mono text-sm font-semibold tabular-nums whitespace-nowrap ${
                          isFastest ? 'text-[#22C55E]' : 'text-white'
                        }`}
                      >
                        {row.avgLatencyMs.toFixed(2)} ms
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-sm text-slate-300 tabular-nums whitespace-nowrap">
                        {row.minLatencyMs.toFixed(2)} ms
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-sm text-slate-300 tabular-nums whitespace-nowrap">
                        {row.maxLatencyMs.toFixed(2)} ms
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-sm font-medium text-white tabular-nums whitespace-nowrap">
                        {row.successRate.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
