export type DnsProviderId = 'google' | 'cloudflare' | 'quad9';

export type DnsQueryType = 'A';

export type NavigationSection =
  | 'overview'
  | 'benchmark'
  | 'analytics'
  | 'history'
  | 'settings';

export type DataOrigin = 'live' | 'sample';

export type BenchmarkExecutionPhase =
  | 'idle'
  | 'submitting'
  | 'running'
  | 'completed'
  | 'error'
  | 'sample_preview';

export type ProviderHealthStatus = 'operational' | 'degraded' | 'unreachable';

export interface DnsProviderInfo {
  id: DnsProviderId;
  name: string;
  serverIp: string;
  description: string;
  accentColor: string;
}

export interface BenchmarkConfig {
  domain: string;
  providers: DnsProviderId[];
  iterations: 5 | 10 | 20;
  queryType: DnsQueryType;
}

export interface IterationLatencyPoint {
  iteration: number;
  latencyMs: number | null;
  success: boolean;
  errorReason?: string;
}

export interface ProviderBenchmarkResult {
  providerId: DnsProviderId;
  providerName: string;
  dnsServer: string;
  avgLatencyMs: number;
  minLatencyMs: number;
  maxLatencyMs: number;
  successfulQueries: number;
  failedQueries: number;
  totalQueries: number;
  successRate: number;
  status: ProviderHealthStatus;
  iterations: IterationLatencyPoint[];
}

export interface BenchmarkExperiment {
  experimentId: string;
  domain: string;
  queryType: DnsQueryType;
  iterations: number;
  executedAt: string;
  dataOrigin: DataOrigin;
  providerResults: ProviderBenchmarkResult[];
}

export interface BenchmarkJobProgress {
  jobId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  completedQueries: number;
  totalQueries: number;
  currentProvider?: string;
  errorMessage?: string;
  experiment?: BenchmarkExperiment;
}

export interface OverviewKpiSummary {
  totalQueries: number;
  averageLatencyMs: number;
  fastestProviderName: string;
  fastestProviderLatencyMs: number;
  overallSuccessRate: number;
}

export interface ProviderAggregateStats {
  providerId: DnsProviderId;
  providerName: string;
  dnsServer: string;
  avgLatencyMs: number;
  successfulQueries: number;
  totalQueries: number;
  successRate: number;
  status: ProviderHealthStatus;
}

export interface AppSettings {
  apiBaseUrl: string;
  queryTimeoutMs: number;
  defaultIterations: 5 | 10 | 20;
}
