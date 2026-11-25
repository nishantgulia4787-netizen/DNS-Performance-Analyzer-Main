import type {
  AppSettings,
  BenchmarkConfig,
  BenchmarkExperiment,
  BenchmarkJobProgress,
} from '../types/dns';
import { formatExperimentCsv } from '../utils/dnsMetrics';

const SETTINGS_STORAGE_KEY = 'dns_analyzer_settings_v1';
const LIVE_EXPERIMENTS_STORAGE_KEY = 'dns_analyzer_live_experiments_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  apiBaseUrl: import.meta.env.VITE_DNS_API_URL || 'http://127.0.0.1:8000',
  queryTimeoutMs: 2500,
  defaultIterations: 10,
};

export function loadSettings(): AppSettings {
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      apiBaseUrl: parsed.apiBaseUrl?.trim() || DEFAULT_SETTINGS.apiBaseUrl,
      queryTimeoutMs:
        typeof parsed.queryTimeoutMs === 'number' && parsed.queryTimeoutMs >= 500
          ? parsed.queryTimeoutMs
          : DEFAULT_SETTINGS.queryTimeoutMs,
      defaultIterations:
        parsed.defaultIterations === 5 ||
        parsed.defaultIterations === 10 ||
        parsed.defaultIterations === 20
          ? parsed.defaultIterations
          : DEFAULT_SETTINGS.defaultIterations,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadCachedLiveExperiments(): BenchmarkExperiment[] {
  try {
    const raw = window.localStorage.getItem(LIVE_EXPERIMENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BenchmarkExperiment[];
    return Array.isArray(parsed)
      ? parsed.filter((exp) => exp.dataOrigin === 'live')
      : [];
  } catch {
    return [];
  }
}

export function saveCachedLiveExperiments(experiments: BenchmarkExperiment[]): void {
  try {
    const liveOnly = experiments.filter((exp) => exp.dataOrigin === 'live');
    window.localStorage.setItem(LIVE_EXPERIMENTS_STORAGE_KEY, JSON.stringify(liveOnly));
  } catch {
    // Ignore storage quota errors
  }
}

export function clearCachedLiveExperiments(): void {
  try {
    window.localStorage.removeItem(LIVE_EXPERIMENTS_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

export class BackendConnectionError extends Error {
  public readonly endpoint: string;
  constructor(message: string, endpoint: string) {
    super(message);
    this.name = 'BackendConnectionError';
    this.endpoint = endpoint;
  }
}

async function fetchJsonWithTimeout<T>(
  url: string,
  options: RequestInit = {},
  timeoutMs = 5000
): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(
        detail || `Python FastAPI engine returned HTTP ${response.status} (${response.statusText}).`
      );
    }
    return (await response.json()) as T;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new BackendConnectionError(
        `Request to ${url} timed out after ${timeoutMs} ms.`,
        url
      );
    }
    if (err instanceof TypeError) {
      throw new BackendConnectionError(
        `Python FastAPI DNS engine is not reachable at ${url}. Start the FastAPI server to run live UDP/TCP DNS queries.`,
        url
      );
    }
    throw err;
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * Centralized FastAPI service layer for the Python DNS benchmarking backend:
 * - POST /api/benchmark
 * - GET /api/history
 * - GET /api/results
 */
export const dnsBenchmarkService = {
  async startBenchmark(
    config: BenchmarkConfig,
    settings: AppSettings = DEFAULT_SETTINGS
  ): Promise<BenchmarkJobProgress> {
    const cleanBase = settings.apiBaseUrl.replace(/\/+$/, '');
    const endpoint = `${cleanBase}/api/benchmark`;
    const payload = {
      domain: config.domain,
      providers: config.providers,
      iterations: config.iterations,
      query_type: config.queryType,
      timeout_ms: settings.queryTimeoutMs,
    };

    return fetchJsonWithTimeout<BenchmarkJobProgress>(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      Math.max(settings.queryTimeoutMs + 2000, 5000)
    );
  },

  async getBenchmarkResults(
    jobOrExperimentId?: string,
    settings: AppSettings = DEFAULT_SETTINGS
  ): Promise<BenchmarkJobProgress> {
    const cleanBase = settings.apiBaseUrl.replace(/\/+$/, '');
    const endpoint = jobOrExperimentId
      ? `${cleanBase}/api/results?id=${encodeURIComponent(jobOrExperimentId)}`
      : `${cleanBase}/api/results`;
    return fetchJsonWithTimeout<BenchmarkJobProgress>(
      endpoint,
      { method: 'GET' },
      5000
    );
  },

  async getExperimentHistory(
    settings: AppSettings = DEFAULT_SETTINGS
  ): Promise<BenchmarkExperiment[]> {
    const cleanBase = settings.apiBaseUrl.replace(/\/+$/, '');
    const endpoint = `${cleanBase}/api/history`;
    const experiments = await fetchJsonWithTimeout<BenchmarkExperiment[]>(
      endpoint,
      { method: 'GET' },
      4000
    );
    return experiments.map((exp) => ({
      ...exp,
      dataOrigin: 'live' as const,
    }));
  },

  exportResultsCsv(experiment: BenchmarkExperiment): {
    filename: string;
    csvContent: string;
  } {
    const csvContent = formatExperimentCsv(experiment);
    const safeDomain = experiment.domain.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `dns-benchmark_${safeDomain}_${experiment.experimentId}.csv`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);

    return { filename, csvContent };
  },
};
