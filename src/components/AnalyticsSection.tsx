import { Download } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { BenchmarkExperiment } from '../types/dns';
import { DNS_PROVIDERS, formatTimestamp } from '../utils/dnsMetrics';
import {
  VIEWPORT_ONCE,
  cardGridContainer,
  fadeUpItem,
  sectionReveal,
} from '../utils/motionVariants';

interface AnalyticsSectionProps {
  experiments: BenchmarkExperiment[];
  selectedExperimentId: string;
  onSelectExperiment: (experimentId: string) => void;
  onExportCsv: (experiment: BenchmarkExperiment) => void;
}

const TOOLTIP_STYLE = {
  backgroundColor: '#070B14',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '10px',
  color: '#F8FAFC',
  fontSize: '12px',
  transition: 'opacity 150ms ease, transform 150ms ease',
};

export function AnalyticsSection({
  experiments,
  selectedExperimentId,
  onSelectExperiment,
  onExportCsv,
}: AnalyticsSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [chartsInView, setChartsInView] = useState(false);

  const experiment =
    experiments.find((e) => e.experimentId === selectedExperimentId) ??
    experiments[0];

  if (!experiment) return null;

  const comparisonData = experiment.providerResults.map((res) => ({
    provider: res.providerName,
    avgLatencyMs: res.avgLatencyMs,
    color:
      res.providerId === 'google'
        ? '#1D7AFC'
        : res.providerId === 'cloudflare'
        ? '#38BDF8'
        : '#0EA5E9',
  }));

  const maxIterations = Math.max(
    0,
    ...experiment.providerResults.map((r) => r.iterations.length)
  );

  const iterationSeriesData = Array.from({ length: maxIterations }, (_, idx) => {
    const iterationNumber = idx + 1;
    const point: Record<string, string | number | null> = {
      iteration: `#${iterationNumber}`,
    };
    for (const res of experiment.providerResults) {
      const sample = res.iterations.find((it) => it.iteration === iterationNumber);
      point[res.providerName] = sample?.success ? sample.latencyMs : null;
    }
    return point;
  });

  const reliabilityData = experiment.providerResults.map((res) => ({
    provider: res.providerName,
    Successful: res.successfulQueries,
    Failed: res.failedQueries,
  }));

  const distributionData = experiment.providerResults.map((res) => ({
    provider: res.providerName,
    Minimum: res.minLatencyMs,
    Average: res.avgLatencyMs,
    Maximum: res.maxLatencyMs,
  }));

  const enableChartAnimation = !prefersReducedMotion;
  const shouldRenderCharts = Boolean(chartsInView || prefersReducedMotion);
  const chartRenderKey = experiment.experimentId;

  return (
    <section
      id="analytics"
      className="scroll-mt-20 border-t border-white/15 bg-[#050505] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 space-y-10">
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#38BDF8]">
              TELEMETRY & VISUALIZATION ·{' '}
              {experiment.dataOrigin === 'live' ? 'LIVE DATA' : 'SAMPLE DATASET'}
            </p>
            <h2 className="font-display mt-3 text-3xl font-light tracking-tight text-white sm:text-4xl">
              Numbers tell <span className="font-semibold">the story.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label
                htmlFor="analytics-dataset-select"
                className="block text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400"
              >
                Dataset
              </label>
              <select
                id="analytics-dataset-select"
                value={experiment.experimentId}
                onChange={(e) => onSelectExperiment(e.target.value)}
                className="mt-1.5 rounded-xl border border-white/15 bg-[#0A0F1A] px-3.5 py-2 text-xs text-white transition-all duration-150 focus:border-[#38BDF8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
              >
                {experiments.map((exp) => (
                  <option key={exp.experimentId} value={exp.experimentId}>
                    {exp.domain} ({exp.dataOrigin === 'live' ? 'Live' : 'Sample'} ·{' '}
                    {formatTimestamp(exp.executedAt)})
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onExportCsv(experiment)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-[#38BDF8]/60 hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Export CSV</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          variants={cardGridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.06 }}
          onViewportEnter={() => setChartsInView(true)}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          {/* 1. Provider Comparison */}
          <motion.article
            variants={fadeUpItem}
            className="rounded-2xl border border-white/12 bg-[#080D17] p-6 transition-colors duration-200 hover:border-white/20"
          >
            <div className="mb-5">
              <h3 className="font-display text-base font-semibold text-white">
                Provider Comparison
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Average DNS response time in milliseconds across providers
              </p>
            </div>
            <div className="h-72 w-full">
              {shouldRenderCharts && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  key={`cmp-${chartRenderKey}`}
                  data={comparisonData}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="provider"
                    stroke="#94A3B8"
                    tick={{ fill: '#CBD5E1', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    unit=" ms"
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }}
                    formatter={(value) => [
                      typeof value === 'number'
                        ? `${value.toFixed(2)} ms`
                        : `${value ?? '—'}`,
                      'Average Latency',
                    ]}
                  />
                  <Bar
                    dataKey="avgLatencyMs"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={58}
                    isAnimationActive={enableChartAnimation}
                    animationDuration={550}
                    animationEasing="ease-out"
                  >
                    {comparisonData.map((entry) => (
                      <Cell key={entry.provider} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>
          </motion.article>

          {/* 2. Response Time Analysis */}
          <motion.article
            variants={fadeUpItem}
            className="rounded-2xl border border-white/12 bg-[#080D17] p-6 transition-colors duration-200 hover:border-white/20"
          >
            <div className="mb-5">
              <h3 className="font-display text-base font-semibold text-white">
                Response Time Analysis
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Individual query response times across sequential iterations
              </p>
            </div>
            <div className="h-72 w-full">
              {shouldRenderCharts && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  key={`line-${chartRenderKey}`}
                  data={iterationSeriesData}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.08)"
                  />
                  <XAxis
                    dataKey="iteration"
                    stroke="#94A3B8"
                    tick={{ fill: '#CBD5E1', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    unit=" ms"
                  />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: '#CBD5E1' }} />
                  {experiment.providerResults.map((res) => (
                    <Line
                      key={res.providerId}
                      type="monotone"
                      dataKey={res.providerName}
                      stroke={DNS_PROVIDERS[res.providerId].accentColor}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      connectNulls={false}
                      isAnimationActive={enableChartAnimation}
                      animationDuration={550}
                      animationEasing="ease-out"
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              )}
            </div>
          </motion.article>

          {/* 3. Reliability Analysis */}
          <motion.article
            variants={fadeUpItem}
            className="rounded-2xl border border-white/12 bg-[#080D17] p-6 transition-colors duration-200 hover:border-white/20"
          >
            <div className="mb-5">
              <h3 className="font-display text-base font-semibold text-white">
                Reliability Analysis
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Successful versus failed DNS queries per resolver
              </p>
            </div>
            <div className="h-72 w-full">
              {shouldRenderCharts && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  key={`rel-${chartRenderKey}`}
                  data={reliabilityData}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="provider"
                    stroke="#94A3B8"
                    tick={{ fill: '#CBD5E1', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', color: '#CBD5E1' }} />
                  <Bar
                    dataKey="Successful"
                    stackId="queries"
                    fill="#1D7AFC"
                    maxBarSize={54}
                    isAnimationActive={enableChartAnimation}
                    animationDuration={550}
                    animationEasing="ease-out"
                  />
                  <Bar
                    dataKey="Failed"
                    stackId="queries"
                    fill="#EF4444"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={54}
                    isAnimationActive={enableChartAnimation}
                    animationDuration={550}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>
          </motion.article>

          {/* 4. Performance Distribution */}
          <motion.article
            variants={fadeUpItem}
            className="rounded-2xl border border-white/12 bg-[#080D17] p-6 transition-colors duration-200 hover:border-white/20"
          >
            <div className="mb-5">
              <h3 className="font-display text-base font-semibold text-white">
                Performance Distribution
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Minimum, average, and maximum response time spread (ms)
              </p>
            </div>
            <div className="h-72 w-full">
              {shouldRenderCharts && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  key={`dist-${chartRenderKey}`}
                  data={distributionData}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="provider"
                    stroke="#94A3B8"
                    tick={{ fill: '#CBD5E1', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    unit=" ms"
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', color: '#CBD5E1' }} />
                  <Bar
                    dataKey="Minimum"
                    fill="#22D3EE"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={24}
                    isAnimationActive={enableChartAnimation}
                    animationDuration={550}
                    animationEasing="ease-out"
                  />
                  <Bar
                    dataKey="Average"
                    fill="#1D7AFC"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={24}
                    isAnimationActive={enableChartAnimation}
                    animationDuration={550}
                    animationEasing="ease-out"
                  />
                  <Bar
                    dataKey="Maximum"
                    fill="#64748B"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={24}
                    isAnimationActive={enableChartAnimation}
                    animationDuration={550}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}
