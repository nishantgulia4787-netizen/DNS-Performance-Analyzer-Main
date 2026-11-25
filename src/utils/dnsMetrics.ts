import type {
  BenchmarkExperiment,
  DnsProviderId,
  DnsProviderInfo,
  OverviewKpiSummary,
  ProviderAggregateStats,
  ProviderBenchmarkResult,
} from '../types/dns';

export const DNS_PROVIDERS: Record<DnsProviderId, DnsProviderInfo> = {
  google: {
    id: 'google',
    name: 'Google DNS',
    serverIp: '8.8.8.8',
    description: 'Google Public DNS Anycast Resolver',
    accentColor: '#3B82F6',
  },
  cloudflare: {
    id: 'cloudflare',
    name: 'Cloudflare DNS',
    serverIp: '1.1.1.1',
    description: 'Cloudflare Privacy-First Anycast Resolver',
    accentColor: '#22D3EE',
  },
  quad9: {
    id: 'quad9',
    name: 'Quad9 DNS',
    serverIp: '9.9.9.9',
    description: 'Quad9 Threat-Blocking Recursive Resolver',
    accentColor: '#22C55E',
  },
};

export const PROVIDER_LIST: DnsProviderInfo[] = [
  DNS_PROVIDERS.google,
  DNS_PROVIDERS.cloudflare,
  DNS_PROVIDERS.quad9,
];

const DOMAIN_REGEX =
  /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;

export function validateDomain(rawDomain: string): {
  valid: boolean;
  normalized: string;
  error?: string;
} {
  const trimmed = rawDomain.trim().toLowerCase().replace(/\.$/, '');
  if (!trimmed) {
    return {
      valid: false,
      normalized: '',
      error: 'Enter a domain name to benchmark (for example, example.com).',
    };
  }
  if (trimmed.includes('://') || trimmed.includes('/')) {
    return {
      valid: false,
      normalized: trimmed,
      error: 'Enter a bare hostname without protocol or path (for example, example.com).',
    };
  }
  if (!DOMAIN_REGEX.test(trimmed)) {
    return {
      valid: false,
      normalized: trimmed,
      error: 'Enter a valid fully qualified domain name (for example, example.com).',
    };
  }
  return { valid: true, normalized: trimmed };
}

export function findFastestProvider(
  results: ProviderBenchmarkResult[]
): ProviderBenchmarkResult | null {
  const eligible = results.filter((r) => r.successfulQueries > 0 && r.avgLatencyMs > 0);
  if (eligible.length === 0) return null;
  return eligible.reduce((fastest, current) =>
    current.avgLatencyMs < fastest.avgLatencyMs ? current : fastest
  );
}

export function computeOverviewKpis(
  experiments: BenchmarkExperiment[]
): OverviewKpiSummary {
  if (experiments.length === 0) {
    return {
      totalQueries: 0,
      averageLatencyMs: 0,
      fastestProviderName: '—',
      fastestProviderLatencyMs: 0,
      overallSuccessRate: 0,
    };
  }

  let totalQueries = 0;
  let totalSuccessful = 0;
  let weightedLatencySum = 0;

  const providerStats = aggregateProviderStats(experiments);

  for (const exp of experiments) {
    for (const res of exp.providerResults) {
      totalQueries += res.totalQueries;
      totalSuccessful += res.successfulQueries;
      if (res.successfulQueries > 0) {
        weightedLatencySum += res.avgLatencyMs * res.successfulQueries;
      }
    }
  }

  const averageLatencyMs =
    totalSuccessful > 0 ? Number((weightedLatencySum / totalSuccessful).toFixed(2)) : 0;
  const overallSuccessRate =
    totalQueries > 0 ? Number(((totalSuccessful / totalQueries) * 100).toFixed(1)) : 0;

  const activeProviders = providerStats.filter((p) => p.successfulQueries > 0);
  const fastest =
    activeProviders.length > 0
      ? activeProviders.reduce((best, cur) =>
          cur.avgLatencyMs < best.avgLatencyMs ? cur : best
        )
      : null;

  return {
    totalQueries,
    averageLatencyMs,
    fastestProviderName: fastest ? fastest.providerName : '—',
    fastestProviderLatencyMs: fastest ? fastest.avgLatencyMs : 0,
    overallSuccessRate,
  };
}

export function aggregateProviderStats(
  experiments: BenchmarkExperiment[]
): ProviderAggregateStats[] {
  const map = new Map<
    DnsProviderId,
    {
      successfulQueries: number;
      totalQueries: number;
      weightedLatency: number;
    }
  >();

  for (const provider of PROVIDER_LIST) {
    map.set(provider.id, {
      successfulQueries: 0,
      totalQueries: 0,
      weightedLatency: 0,
    });
  }

  for (const exp of experiments) {
    for (const res of exp.providerResults) {
      const entry = map.get(res.providerId);
      if (!entry) continue;
      entry.totalQueries += res.totalQueries;
      entry.successfulQueries += res.successfulQueries;
      if (res.successfulQueries > 0) {
        entry.weightedLatency += res.avgLatencyMs * res.successfulQueries;
      }
    }
  }

  return PROVIDER_LIST.map((provider) => {
    const entry = map.get(provider.id)!;
    const avgLatencyMs =
      entry.successfulQueries > 0
        ? Number((entry.weightedLatency / entry.successfulQueries).toFixed(2))
        : 0;
    const successRate =
      entry.totalQueries > 0
        ? Number(((entry.successfulQueries / entry.totalQueries) * 100).toFixed(1))
        : 0;

    let status: ProviderAggregateStats['status'] = 'operational';
    if (entry.totalQueries === 0 || successRate < 80) {
      status = entry.totalQueries === 0 ? 'unreachable' : 'degraded';
    } else if (successRate < 98) {
      status = 'degraded';
    }

    return {
      providerId: provider.id,
      providerName: provider.name,
      dnsServer: provider.serverIp,
      avgLatencyMs,
      successfulQueries: entry.successfulQueries,
      totalQueries: entry.totalQueries,
      successRate,
      status,
    };
  });
}

export interface ExperimentFilterOptions {
  searchQuery: string;
  providerFilter: DnsProviderId | 'all';
  originFilter: 'all' | 'live' | 'sample';
}

export function filterExperiments(
  experiments: BenchmarkExperiment[],
  options: ExperimentFilterOptions
): BenchmarkExperiment[] {
  const query = options.searchQuery.trim().toLowerCase();

  return experiments.filter((exp) => {
    if (options.originFilter !== 'all' && exp.dataOrigin !== options.originFilter) {
      return false;
    }

    if (
      options.providerFilter !== 'all' &&
      !exp.providerResults.some((r) => r.providerId === options.providerFilter)
    ) {
      return false;
    }

    if (query) {
      const matchesDomain = exp.domain.toLowerCase().includes(query);
      const matchesId = exp.experimentId.toLowerCase().includes(query);
      if (!matchesDomain && !matchesId) {
        return false;
      }
    }

    return true;
  });
}

function escapeCsvCell(value: string | number): string {
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function formatExperimentCsv(experiment: BenchmarkExperiment): string {
  const headers = [
    'Experiment ID',
    'Data Origin',
    'Domain',
    'Query Type',
    'Executed At',
    'DNS Provider',
    'DNS Server',
    'Average Response Time (ms)',
    'Minimum Response Time (ms)',
    'Maximum Response Time (ms)',
    'Successful Queries',
    'Total Queries',
    'Success Rate (%)',
  ];

  const rows = experiment.providerResults.map((res) =>
    [
      experiment.experimentId,
      experiment.dataOrigin === 'sample' ? 'Sample Data (Prototype)' : 'Live Benchmark',
      experiment.domain,
      experiment.queryType,
      experiment.executedAt,
      res.providerName,
      res.dnsServer,
      res.avgLatencyMs.toFixed(2),
      res.minLatencyMs.toFixed(2),
      res.maxLatencyMs.toFixed(2),
      res.successfulQueries,
      res.totalQueries,
      res.successRate.toFixed(1),
    ]
      .map(escapeCsvCell)
      .join(',')
  );

  return [headers.map(escapeCsvCell).join(','), ...rows].join('\n');
}

export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function computeExperimentAverageLatency(exp: BenchmarkExperiment): number {
  let totalSuccess = 0;
  let weightedSum = 0;
  for (const res of exp.providerResults) {
    if (res.successfulQueries > 0) {
      totalSuccess += res.successfulQueries;
      weightedSum += res.avgLatencyMs * res.successfulQueries;
    }
  }
  if (totalSuccess === 0) return 0;
  return Number((weightedSum / totalSuccess).toFixed(2));
}
