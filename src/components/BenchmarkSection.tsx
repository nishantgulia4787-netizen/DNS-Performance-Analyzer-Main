import {
  AlertCircle,
  Check,
  CheckCircle2,
  Loader2,
  Play,
  ServerOff,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState, type FormEvent } from 'react';
import type {
  BenchmarkConfig,
  BenchmarkExecutionPhase,
  DnsProviderId,
} from '../types/dns';
import { PROVIDER_LIST, validateDomain } from '../utils/dnsMetrics';
import {
  EASE_OUT_EXPO,
  VIEWPORT_ONCE,
  sectionReveal,
  statusPresence,
} from '../utils/motionVariants';

interface BenchmarkSectionProps {
  apiBaseUrl: string;
  executionPhase: BenchmarkExecutionPhase;
  completedQueries: number;
  totalQueries: number;
  currentProviderLabel: string | null;
  errorMessage: string | null;
  onStartBenchmark: (config: BenchmarkConfig) => void;
  onLoadSamplePreview: (config: BenchmarkConfig) => void;
}

const ITERATION_OPTIONS: Array<5 | 10 | 20> = [5, 10, 20];

function formatProviderDisplayLabel(id: DnsProviderId, name: string): string {
  if (id === 'quad9') return 'Quad9';
  return name;
}

export function BenchmarkSection({
  apiBaseUrl,
  executionPhase,
  completedQueries,
  totalQueries,
  currentProviderLabel,
  errorMessage,
  onStartBenchmark,
  onLoadSamplePreview,
}: BenchmarkSectionProps) {
  const [domain, setDomain] = useState('');
  const [selectedProviders, setSelectedProviders] = useState<DnsProviderId[]>([
    'google',
    'cloudflare',
    'quad9',
  ]);
  const [iterations, setIterations] = useState<5 | 10 | 20>(10);
  const [validationError, setValidationError] = useState<string | null>(null);

  const isBusy =
    executionPhase === 'submitting' || executionPhase === 'running';

  const progressPercent =
    totalQueries > 0
      ? Math.min(100, Math.round((completedQueries / totalQueries) * 100))
      : 0;

  const toggleProvider = (providerId: DnsProviderId) => {
    setValidationError(null);
    setSelectedProviders((prev) =>
      prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId]
    );
  };

  const buildValidatedConfig = (): BenchmarkConfig | null => {
    const domainCheck = validateDomain(domain);
    if (!domainCheck.valid) {
      setValidationError(
        domainCheck.error ?? 'Enter a valid domain name (e.g. google.com).'
      );
      return null;
    }
    if (selectedProviders.length === 0) {
      setValidationError('Select at least one DNS provider to test.');
      return null;
    }
    setValidationError(null);
    setDomain(domainCheck.normalized);
    return {
      domain: domainCheck.normalized,
      providers: selectedProviders,
      iterations,
      queryType: 'A',
    };
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const config = buildValidatedConfig();
    if (!config) return;
    onStartBenchmark(config);
  };

  const handleSamplePreviewClick = () => {
    const trimmed = domain.trim();
    if (trimmed.length > 0) {
      const config = buildValidatedConfig();
      if (!config) return;
      onLoadSamplePreview(config);
      return;
    }

    if (selectedProviders.length === 0) {
      setValidationError('Select at least one DNS provider to preview.');
      return;
    }

    setValidationError(null);
    onLoadSamplePreview({
      domain: 'google.com',
      providers: selectedProviders,
      iterations,
      queryType: 'A',
    });
  };

  const statusText = (() => {
    if (executionPhase === 'submitting') {
      return 'Dispatching benchmark request to Python FastAPI engine...';
    }
    if (executionPhase === 'running') {
      return currentProviderLabel
        ? `Querying ${currentProviderLabel}...`
        : 'Executing live DNS queries...';
    }
    if (executionPhase === 'completed') {
      return 'Live benchmark completed. Results revealed below.';
    }
    if (executionPhase === 'error') {
      return 'FastAPI DNS engine connection failed';
    }
    if (executionPhase === 'sample_preview') {
      return 'Sample preview loaded (mock data — no live DNS packets sent)';
    }
    return '';
  })();

  return (
    <section
      id="benchmark"
      className="scroll-mt-20 border-t border-white/15 bg-[#050505] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="text-center"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#38BDF8]">
            INTERACTIVE DNS BENCHMARK
          </p>
          <h2 className="font-display mt-3 text-3xl font-light tracking-tight text-white sm:text-4xl">
            Let&apos;s test your <span className="font-semibold">DNS performance.</span>
          </h2>
          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            Run real DNS queries and compare the performance of different providers.
          </p>
        </motion.div>

        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mt-12 rounded-[26px] border border-white/20 bg-gradient-to-br from-[#0F2347]/50 via-[#0A1324]/80 to-[#060911]/95 p-6 sm:p-10 backdrop-blur-xl transition-all duration-300 hover:border-[#38BDF8]/45 hover:shadow-[0_0_50px_rgba(29,122,252,0.22)]"
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="md:col-span-6">
                <label
                  htmlFor="domain-input"
                  className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300"
                >
                  DOMAIN INPUT
                </label>
                <input
                  id="domain-input"
                  type="text"
                  value={domain}
                  onChange={(e) => {
                    setDomain(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="Enter domain (e.g. google.com)"
                  disabled={isBusy}
                  className="mt-2.5 block w-full rounded-xl border border-white/15 bg-[#050811]/90 px-4 py-3 font-mono text-sm text-white placeholder-slate-500 transition-all duration-200 focus:border-[#38BDF8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 focus:shadow-[0_0_22px_rgba(56,189,248,0.2)] disabled:opacity-60"
                />
              </div>

              <div className="md:col-span-3">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  TEST ITERATIONS
                </span>
                <div
                  role="group"
                  aria-label="Test Iterations"
                  className="mt-2.5 grid grid-cols-3 gap-1.5 rounded-xl border border-white/15 bg-[#050811]/90 p-1"
                >
                  {ITERATION_OPTIONS.map((count) => {
                    const active = iterations === count;
                    return (
                      <motion.button
                        key={count}
                        type="button"
                        disabled={isBusy}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIterations(count)}
                        aria-pressed={active}
                        className={`relative rounded-lg py-2 font-mono text-sm font-medium tabular-nums transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] ${
                          active
                            ? 'text-white'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="iteration-active-bg"
                            transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
                            className="absolute inset-0 rounded-lg bg-[#1D7AFC] shadow-[0_0_16px_rgba(29,122,252,0.4)]"
                          />
                        )}
                        <span className="relative z-10">{count}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-3">
                <label
                  htmlFor="query-type-select"
                  className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300"
                >
                  QUERY TYPE
                </label>
                <select
                  id="query-type-select"
                  value="A"
                  disabled={isBusy}
                  onChange={() => {
                    // A Record (IPv4) per specification
                  }}
                  className="mt-2.5 block w-full rounded-xl border border-white/15 bg-[#050811]/90 px-4 py-3 text-sm text-white transition-all duration-200 focus:border-[#38BDF8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 focus:shadow-[0_0_22px_rgba(56,189,248,0.2)] disabled:opacity-60"
                >
                  <option value="A">A Record (IPv4)</option>
                </select>
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                DNS PROVIDERS
              </span>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {PROVIDER_LIST.map((provider) => {
                  const checked = selectedProviders.includes(provider.id);
                  const displayName = formatProviderDisplayLabel(
                    provider.id,
                    provider.name
                  );
                  return (
                    <motion.label
                      key={provider.id}
                      whileHover={isBusy ? undefined : { y: -2 }}
                      whileTap={isBusy ? undefined : { scale: 0.985 }}
                      transition={{ duration: 0.16, ease: EASE_OUT_EXPO }}
                      className={`flex cursor-pointer items-center gap-3.5 rounded-xl border px-4 py-3.5 transition-all duration-200 ${
                        checked
                          ? 'border-[#38BDF8]/75 bg-[#1D7AFC]/16 shadow-[0_0_26px_rgba(29,122,252,0.2)]'
                          : 'border-white/12 bg-[#050811]/75 hover:border-white/30'
                      } ${isBusy ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={isBusy}
                        onChange={() => toggleProvider(provider.id)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors duration-150 ${
                          checked
                            ? 'border-[#38BDF8] bg-[#1D7AFC] text-white'
                            : 'border-white/25 bg-black/40'
                        }`}
                      >
                        <AnimatePresence initial={false}>
                          {checked && (
                            <motion.span
                              initial={{ scale: 0.4, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.4, opacity: 0 }}
                              transition={{ duration: 0.14 }}
                              className="flex items-center justify-center"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-white truncate">
                          {displayName} –{' '}
                          <span className="font-mono text-[#38BDF8] tabular-nums">
                            {provider.serverIp}
                          </span>
                        </span>
                      </span>
                    </motion.label>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {validationError && (
                <motion.div
                  key={validationError}
                  variants={statusPresence}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  role="alert"
                  className="flex items-center gap-2.5 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 text-[#EF4444]" aria-hidden="true" />
                  <span>{validationError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
              <p className="text-xs text-slate-400 tabular-nums">
                Scheduled queries:{' '}
                <span className="font-mono font-semibold text-white">
                  {selectedProviders.length * iterations}
                </span>{' '}
                · FastAPI endpoint:{' '}
                <code className="font-mono text-slate-300">{apiBaseUrl}/api/benchmark</code>
              </p>

              <motion.button
                type="submit"
                disabled={isBusy}
                whileHover={isBusy ? undefined : { scale: 1.02 }}
                whileTap={isBusy ? undefined : { scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#1D7AFC] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all duration-150 hover:bg-[#3B82F6] hover:shadow-[0_0_28px_rgba(59,130,246,0.55)] disabled:cursor-not-allowed disabled:opacity-65 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]"
              >
                {isBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Play className="h-4 w-4" aria-hidden="true" />
                )}
                <span>
                  {executionPhase === 'submitting'
                    ? 'CONNECTING TO ENGINE...'
                    : executionPhase === 'running'
                    ? 'RUNNING BENCHMARK...'
                    : 'RUN DNS BENCHMARK'}
                </span>
              </motion.button>
            </div>
          </form>

          {/* Animated Progress Indicator + States */}
          <AnimatePresence>
            {executionPhase !== 'idle' && (
              <motion.div
                key="execution-status-block"
                variants={statusPresence}
                initial="initial"
                animate="animate"
                exit="exit"
                className="mt-8 border-t border-white/12 pt-6 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${executionPhase}-${currentProviderLabel ?? ''}`}
                      variants={statusPresence}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="flex items-center gap-2.5"
                    >
                      {isBusy && (
                        <Loader2
                          className="h-4 w-4 animate-spin text-[#38BDF8]"
                          aria-hidden="true"
                        />
                      )}
                      {executionPhase === 'completed' && (
                        <CheckCircle2
                          className="h-4 w-4 text-[#22C55E]"
                          aria-hidden="true"
                        />
                      )}
                      {executionPhase === 'error' && (
                        <ServerOff
                          className="h-4 w-4 text-[#EF4444]"
                          aria-hidden="true"
                        />
                      )}
                      <span className="text-sm font-medium text-white">
                        {statusText}
                      </span>
                    </motion.div>
                  </AnimatePresence>

                  <span className="font-mono text-xs text-slate-300 tabular-nums">
                    {completedQueries} / {totalQueries} queries ({progressPercent}%)
                  </span>
                </div>

                <div
                  role="progressbar"
                  aria-valuenow={progressPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="DNS benchmark progress"
                  className="h-2 w-full overflow-hidden rounded-full border border-white/10 bg-[#050811]"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                    className={`h-full ${
                      executionPhase === 'error'
                        ? 'bg-[#EF4444]'
                        : executionPhase === 'completed'
                        ? 'bg-[#22C55E]'
                        : executionPhase === 'sample_preview'
                        ? 'bg-[#38BDF8]'
                        : 'bg-gradient-to-r from-[#1D7AFC] to-[#22D3EE]'
                    }`}
                  />
                </div>

                {executionPhase === 'error' && errorMessage && (
                  <motion.div
                    variants={statusPresence}
                    initial="initial"
                    animate="animate"
                    role="alert"
                    className="rounded-xl border border-[#EF4444]/35 bg-[#EF4444]/10 p-4 space-y-3"
                  >
                    <p className="text-xs leading-relaxed text-slate-200">
                      {errorMessage}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleSamplePreviewClick}
                        className="rounded-lg border border-white/20 bg-white/8 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:border-[#38BDF8]/60 hover:bg-white/12 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
                      >
                        Preview Sample Results
                      </motion.button>
                      <span className="text-xs text-slate-400">
                        Loads clearly labelled prototype sample data to preview the results & analytics sections.
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {executionPhase === 'idle' && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-slate-400">
              <span>
                No Python FastAPI server running locally? You can inspect the results layout with isolated sample data.
              </span>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={handleSamplePreviewClick}
                className="font-medium text-[#38BDF8] hover:text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] rounded"
              >
                Preview Sample Results
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
