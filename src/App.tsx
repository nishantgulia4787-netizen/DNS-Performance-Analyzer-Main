import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AboutTechnologySection } from './components/AboutTechnologySection';
import { AnalyticsSection } from './components/AnalyticsSection';
import { BenchmarkSection } from './components/BenchmarkSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { IntroSection } from './components/IntroSection';
import { ResultsSection } from './components/ResultsSection';
import { TopNav } from './components/TopNav';
import {
  SAMPLE_EXPERIMENTS,
  buildSamplePreviewExperiment,
} from './data/sampleBenchmarks';
import {
  DEFAULT_SETTINGS,
  dnsBenchmarkService,
  loadCachedLiveExperiments,
  saveCachedLiveExperiments,
} from './services/dnsBenchmarkService';
import type {
  BenchmarkConfig,
  BenchmarkExecutionPhase,
  BenchmarkExperiment,
} from './types/dns';
import { statusPresence } from './utils/motionVariants';

export default function App() {
  const [liveExperiments, setLiveExperiments] = useState<BenchmarkExperiment[]>(
    () => loadCachedLiveExperiments()
  );
  const [samplePreviewResult, setSamplePreviewResult] =
    useState<BenchmarkExperiment | null>(null);

  const [executionPhase, setExecutionPhase] =
    useState<BenchmarkExecutionPhase>('idle');
  const [completedQueries, setCompletedQueries] = useState(0);
  const [totalQueries, setTotalQueries] = useState(0);
  const [currentProviderLabel, setCurrentProviderLabel] = useState<string | null>(
    null
  );
  const [benchmarkError, setBenchmarkError] = useState<string | null>(null);
  const [activeBenchmarkResult, setActiveBenchmarkResult] =
    useState<BenchmarkExperiment | null>(null);

  const availableAnalyticsExperiments = useMemo(() => {
    const list: BenchmarkExperiment[] = [...liveExperiments];
    if (samplePreviewResult) {
      list.push(samplePreviewResult);
    }
    return [...list, ...SAMPLE_EXPERIMENTS];
  }, [liveExperiments, samplePreviewResult]);

  const [selectedAnalyticsId, setSelectedAnalyticsId] = useState<string>(
    () =>
      liveExperiments[0]?.experimentId ?? SAMPLE_EXPERIMENTS[0].experimentId
  );

  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const pollingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (pollingTimerRef.current !== null) {
        window.clearTimeout(pollingTimerRef.current);
      }
    };
  }, []);

  const scrollToResults = () => {
    window.setTimeout(() => {
      const el = document.getElementById('results');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleStartBenchmark = async (config: BenchmarkConfig) => {
    if (pollingTimerRef.current !== null) {
      window.clearTimeout(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }

    const scheduledTotal = config.providers.length * config.iterations;
    setExecutionPhase('submitting');
    setCompletedQueries(0);
    setTotalQueries(scheduledTotal);
    setCurrentProviderLabel(null);
    setBenchmarkError(null);

    try {
      const initialJob = await dnsBenchmarkService.startBenchmark(
        config,
        DEFAULT_SETTINGS
      );

      if (initialJob.status === 'completed' && initialJob.experiment) {
        const liveExp: BenchmarkExperiment = {
          ...initialJob.experiment,
          dataOrigin: 'live',
        };
        const updatedLive = [liveExp, ...liveExperiments];
        setLiveExperiments(updatedLive);
        saveCachedLiveExperiments(updatedLive);
        setCompletedQueries(scheduledTotal);
        setExecutionPhase('completed');
        setActiveBenchmarkResult(liveExp);
        setSelectedAnalyticsId(liveExp.experimentId);
        scrollToResults();
        return;
      }

      if (initialJob.status === 'failed') {
        setExecutionPhase('error');
        setBenchmarkError(
          initialJob.errorMessage ?? 'Benchmark failed on Python FastAPI backend.'
        );
        return;
      }

      setExecutionPhase('running');
      setCompletedQueries(initialJob.completedQueries);
      setTotalQueries(initialJob.totalQueries || scheduledTotal);
      setCurrentProviderLabel(initialJob.currentProvider ?? null);

      const pollJob = async (jobId: string) => {
        try {
          const progress = await dnsBenchmarkService.getBenchmarkResults(
            jobId,
            DEFAULT_SETTINGS
          );
          setCompletedQueries(progress.completedQueries);
          setTotalQueries(progress.totalQueries || scheduledTotal);
          setCurrentProviderLabel(progress.currentProvider ?? null);

          if (progress.status === 'completed' && progress.experiment) {
            const liveExp: BenchmarkExperiment = {
              ...progress.experiment,
              dataOrigin: 'live',
            };
            setLiveExperiments((prev) => {
              const next = [liveExp, ...prev];
              saveCachedLiveExperiments(next);
              return next;
            });
            setExecutionPhase('completed');
            setActiveBenchmarkResult(liveExp);
            setSelectedAnalyticsId(liveExp.experimentId);
            scrollToResults();
            return;
          }

          if (progress.status === 'failed') {
            setExecutionPhase('error');
            setBenchmarkError(
              progress.errorMessage ?? 'Benchmark execution failed.'
            );
            return;
          }

          pollingTimerRef.current = window.setTimeout(() => {
            void pollJob(jobId);
          }, 700);
        } catch (err) {
          setExecutionPhase('error');
          setBenchmarkError(
            err instanceof Error
              ? err.message
              : 'Lost connection while polling Python FastAPI backend.'
          );
        }
      };

      pollingTimerRef.current = window.setTimeout(() => {
        void pollJob(initialJob.jobId);
      }, 600);
    } catch (err) {
      setExecutionPhase('error');
      setBenchmarkError(
        err instanceof Error
          ? err.message
          : 'Unable to reach Python FastAPI backend.'
      );
    }
  };

  const handleLoadSamplePreview = (config: BenchmarkConfig) => {
    const preview = buildSamplePreviewExperiment(
      config.domain,
      config.providers,
      config.iterations
    );
    const total = config.providers.length * config.iterations;
    setExecutionPhase('sample_preview');
    setCompletedQueries(total);
    setTotalQueries(total);
    setCurrentProviderLabel(null);
    setBenchmarkError(null);
    setSamplePreviewResult(preview);
    setActiveBenchmarkResult(preview);
    setSelectedAnalyticsId(preview.experimentId);
    scrollToResults();
  };

  const handleExportCsv = (experiment: BenchmarkExperiment) => {
    const { filename } = dnsBenchmarkService.exportResultsCsv(experiment);
    setExportNotice(`Exported ${filename}`);
    window.setTimeout(() => {
      setExportNotice((current) =>
        current === `Exported ${filename}` ? null : current
      );
    }, 4000);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#050505] text-[#F8FAFC]">
        <TopNav />

        <AnimatePresence>
          {exportNotice && (
            <motion.div
              key={exportNotice}
              variants={statusPresence}
              initial="initial"
              animate="animate"
              exit="exit"
              role="status"
              className="fixed bottom-5 right-5 z-50 rounded-xl border border-[#22C55E]/40 bg-[#0A1412]/95 px-4 py-2.5 text-xs font-medium text-[#86EFAC] shadow-lg backdrop-blur-md"
            >
              {exportNotice}
            </motion.div>
          )}
        </AnimatePresence>

        <main>
          <HeroSection />
          <IntroSection />
          <BenchmarkSection
            apiBaseUrl={DEFAULT_SETTINGS.apiBaseUrl}
            executionPhase={executionPhase}
            completedQueries={completedQueries}
            totalQueries={totalQueries}
            currentProviderLabel={currentProviderLabel}
            errorMessage={benchmarkError}
            onStartBenchmark={handleStartBenchmark}
            onLoadSamplePreview={handleLoadSamplePreview}
          />
          <AnimatePresence mode="wait">
            {activeBenchmarkResult && (
              <ResultsSection
                key={activeBenchmarkResult.experimentId}
                experiment={activeBenchmarkResult}
                onExportCsv={handleExportCsv}
              />
            )}
          </AnimatePresence>
          <AnalyticsSection
            experiments={availableAnalyticsExperiments}
            selectedExperimentId={selectedAnalyticsId}
            onSelectExperiment={setSelectedAnalyticsId}
            onExportCsv={handleExportCsv}
          />
          <AboutTechnologySection />
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}
