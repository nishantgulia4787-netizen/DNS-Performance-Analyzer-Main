import test from 'node:test';
import assert from 'node:assert/strict';
import {
  aggregateProviderStats,
  computeExperimentAverageLatency,
  computeOverviewKpis,
  filterExperiments,
  findFastestProvider,
  formatExperimentCsv,
  validateDomain,
} from './dnsMetrics';
import type { BenchmarkExperiment } from '../types/dns';

const fixtureExperiments: BenchmarkExperiment[] = [
  {
    experimentId: 'EXP-1001',
    domain: 'example.com',
    queryType: 'A',
    iterations: 10,
    executedAt: '2026-11-12T10:00:00Z',
    dataOrigin: 'sample',
    providerResults: [
      {
        providerId: 'google',
        providerName: 'Google DNS',
        dnsServer: '8.8.8.8',
        avgLatencyMs: 22.4,
        minLatencyMs: 18.1,
        maxLatencyMs: 29.0,
        successfulQueries: 10,
        failedQueries: 0,
        totalQueries: 10,
        successRate: 100,
        status: 'operational',
        iterations: [],
      },
      {
        providerId: 'cloudflare',
        providerName: 'Cloudflare DNS',
        dnsServer: '1.1.1.1',
        avgLatencyMs: 14.2,
        minLatencyMs: 11.4,
        maxLatencyMs: 19.5,
        successfulQueries: 10,
        failedQueries: 0,
        totalQueries: 10,
        successRate: 100,
        status: 'operational',
        iterations: [],
      },
      {
        providerId: 'quad9',
        providerName: 'Quad9 DNS',
        dnsServer: '9.9.9.9',
        avgLatencyMs: 31.0,
        minLatencyMs: 24.5,
        maxLatencyMs: 42.3,
        successfulQueries: 9,
        failedQueries: 1,
        totalQueries: 10,
        successRate: 90,
        status: 'degraded',
        iterations: [],
      },
    ],
  },
  {
    experimentId: 'EXP-1002',
    domain: 'github.com',
    queryType: 'A',
    iterations: 5,
    executedAt: '2026-11-12T11:30:00Z',
    dataOrigin: 'live',
    providerResults: [
      {
        providerId: 'cloudflare',
        providerName: 'Cloudflare DNS',
        dnsServer: '1.1.1.1',
        avgLatencyMs: 16.0,
        minLatencyMs: 13.0,
        maxLatencyMs: 20.0,
        successfulQueries: 5,
        failedQueries: 0,
        totalQueries: 5,
        successRate: 100,
        status: 'operational',
        iterations: [],
      },
    ],
  },
];

test('validateDomain accepts valid hostnames and rejects protocols or empty strings', () => {
  assert.deepEqual(validateDomain(' example.com '), {
    valid: true,
    normalized: 'example.com',
  });
  assert.equal(validateDomain('').valid, false);
  assert.equal(validateDomain('https://example.com').valid, false);
  assert.equal(validateDomain('invalid_host').valid, false);
});

test('findFastestProvider returns provider with lowest positive average latency', () => {
  const fastest = findFastestProvider(fixtureExperiments[0].providerResults);
  assert.equal(fastest?.providerId, 'cloudflare');
  assert.equal(fastest?.avgLatencyMs, 14.2);
  assert.equal(findFastestProvider([]), null);
});

test('computeOverviewKpis aggregates total queries, weighted latency, fastest provider, and success rate', () => {
  const kpis = computeOverviewKpis(fixtureExperiments);
  assert.equal(kpis.totalQueries, 35);
  assert.equal(kpis.fastestProviderName, 'Cloudflare DNS');
  assert.equal(kpis.overallSuccessRate, 97.1);
  assert.ok(kpis.averageLatencyMs > 19 && kpis.averageLatencyMs < 23);
});

test('aggregateProviderStats calculates per-provider summaries across experiments', () => {
  const stats = aggregateProviderStats(fixtureExperiments);
  const cloudflare = stats.find((s) => s.providerId === 'cloudflare');
  assert.equal(cloudflare?.successfulQueries, 15);
  assert.equal(cloudflare?.totalQueries, 15);
  assert.equal(cloudflare?.successRate, 100);
});

test('filterExperiments filters by domain, provider, and data origin without mixing origins', () => {
  const onlyGithub = filterExperiments(fixtureExperiments, {
    searchQuery: 'github',
    providerFilter: 'all',
    originFilter: 'all',
  });
  assert.equal(onlyGithub.length, 1);
  assert.equal(onlyGithub[0].experimentId, 'EXP-1002');

  const noFalseProviderMatch = filterExperiments(fixtureExperiments, {
    searchQuery: 'cloudflare',
    providerFilter: 'all',
    originFilter: 'all',
  });
  assert.equal(noFalseProviderMatch.length, 0);

  const onlySample = filterExperiments(fixtureExperiments, {
    searchQuery: '',
    providerFilter: 'quad9',
    originFilter: 'sample',
  });
  assert.equal(onlySample.length, 1);
  assert.equal(onlySample[0].experimentId, 'EXP-1001');
});

test('formatExperimentCsv produces well-formed CSV with data origin column', () => {
  const csv = formatExperimentCsv(fixtureExperiments[0]);
  const lines = csv.split('\n');
  assert.equal(lines.length, 4);
  assert.ok(lines[0].includes('Data Origin'));
  assert.ok(lines[1].includes('Sample Data (Prototype)'));
  assert.ok(lines[2].includes('1.1.1.1'));
});

test('computeExperimentAverageLatency returns weighted average across successful queries', () => {
  const avg = computeExperimentAverageLatency(fixtureExperiments[1]);
  assert.equal(avg, 16);
});
