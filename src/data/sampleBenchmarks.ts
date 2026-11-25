import type { BenchmarkExperiment } from '../types/dns';

/**
 * Isolated prototype sample dataset.
 * Never mixed with live Python DNS engine results; every record is explicitly
 * marked `dataOrigin: 'sample'` so the UI always labels it as sample data.
 */
export const SAMPLE_EXPERIMENTS: BenchmarkExperiment[] = [
  {
    experimentId: 'SAMPLE-2026-01',
    domain: 'example.com',
    queryType: 'A',
    iterations: 10,
    executedAt: '2026-11-12T18:10:00Z',
    dataOrigin: 'sample',
    providerResults: [
      {
        providerId: 'google',
        providerName: 'Google DNS',
        dnsServer: '8.8.8.8',
        avgLatencyMs: 21.6,
        minLatencyMs: 17.4,
        maxLatencyMs: 28.9,
        successfulQueries: 10,
        failedQueries: 0,
        totalQueries: 10,
        successRate: 100.0,
        status: 'operational',
        iterations: [
          { iteration: 1, latencyMs: 26.2, success: true },
          { iteration: 2, latencyMs: 19.8, success: true },
          { iteration: 3, latencyMs: 20.4, success: true },
          { iteration: 4, latencyMs: 18.7, success: true },
          { iteration: 5, latencyMs: 28.9, success: true },
          { iteration: 6, latencyMs: 22.1, success: true },
          { iteration: 7, latencyMs: 17.4, success: true },
          { iteration: 8, latencyMs: 21.0, success: true },
          { iteration: 9, latencyMs: 20.6, success: true },
          { iteration: 10, latencyMs: 20.9, success: true },
        ],
      },
      {
        providerId: 'cloudflare',
        providerName: 'Cloudflare DNS',
        dnsServer: '1.1.1.1',
        avgLatencyMs: 14.3,
        minLatencyMs: 11.2,
        maxLatencyMs: 19.1,
        successfulQueries: 10,
        failedQueries: 0,
        totalQueries: 10,
        successRate: 100.0,
        status: 'operational',
        iterations: [
          { iteration: 1, latencyMs: 17.8, success: true },
          { iteration: 2, latencyMs: 13.5, success: true },
          { iteration: 3, latencyMs: 14.0, success: true },
          { iteration: 4, latencyMs: 11.2, success: true },
          { iteration: 5, latencyMs: 19.1, success: true },
          { iteration: 6, latencyMs: 13.9, success: true },
          { iteration: 7, latencyMs: 12.6, success: true },
          { iteration: 8, latencyMs: 14.4, success: true },
          { iteration: 9, latencyMs: 13.1, success: true },
          { iteration: 10, latencyMs: 13.4, success: true },
        ],
      },
      {
        providerId: 'quad9',
        providerName: 'Quad9 DNS',
        dnsServer: '9.9.9.9',
        avgLatencyMs: 28.4,
        minLatencyMs: 22.8,
        maxLatencyMs: 39.2,
        successfulQueries: 9,
        failedQueries: 1,
        totalQueries: 10,
        successRate: 90.0,
        status: 'degraded',
        iterations: [
          { iteration: 1, latencyMs: 34.1, success: true },
          { iteration: 2, latencyMs: 27.6, success: true },
          { iteration: 3, latencyMs: 25.0, success: true },
          { iteration: 4, latencyMs: null, success: false, errorReason: 'UDP timeout' },
          { iteration: 5, latencyMs: 39.2, success: true },
          { iteration: 6, latencyMs: 26.8, success: true },
          { iteration: 7, latencyMs: 22.8, success: true },
          { iteration: 8, latencyMs: 27.4, success: true },
          { iteration: 9, latencyMs: 26.2, success: true },
          { iteration: 10, latencyMs: 26.5, success: true },
        ],
      },
    ],
  },
  {
    experimentId: 'SAMPLE-2026-02',
    domain: 'cloudflare.com',
    queryType: 'A',
    iterations: 20,
    executedAt: '2026-11-12T16:45:00Z',
    dataOrigin: 'sample',
    providerResults: [
      {
        providerId: 'google',
        providerName: 'Google DNS',
        dnsServer: '8.8.8.8',
        avgLatencyMs: 19.8,
        minLatencyMs: 15.6,
        maxLatencyMs: 26.4,
        successfulQueries: 20,
        failedQueries: 0,
        totalQueries: 20,
        successRate: 100.0,
        status: 'operational',
        iterations: Array.from({ length: 20 }, (_, i) => ({
          iteration: i + 1,
          latencyMs: Number((18 + ((i * 7) % 9) * 0.85).toFixed(1)),
          success: true,
        })),
      },
      {
        providerId: 'cloudflare',
        providerName: 'Cloudflare DNS',
        dnsServer: '1.1.1.1',
        avgLatencyMs: 11.9,
        minLatencyMs: 9.4,
        maxLatencyMs: 15.8,
        successfulQueries: 20,
        failedQueries: 0,
        totalQueries: 20,
        successRate: 100.0,
        status: 'operational',
        iterations: Array.from({ length: 20 }, (_, i) => ({
          iteration: i + 1,
          latencyMs: Number((10.2 + ((i * 5) % 7) * 0.72).toFixed(1)),
          success: true,
        })),
      },
      {
        providerId: 'quad9',
        providerName: 'Quad9 DNS',
        dnsServer: '9.9.9.9',
        avgLatencyMs: 25.7,
        minLatencyMs: 20.1,
        maxLatencyMs: 34.5,
        successfulQueries: 20,
        failedQueries: 0,
        totalQueries: 20,
        successRate: 100.0,
        status: 'operational',
        iterations: Array.from({ length: 20 }, (_, i) => ({
          iteration: i + 1,
          latencyMs: Number((22.5 + ((i * 6) % 8) * 1.1).toFixed(1)),
          success: true,
        })),
      },
    ],
  },
  {
    experimentId: 'SAMPLE-2026-03',
    domain: 'ieee.org',
    queryType: 'A',
    iterations: 10,
    executedAt: '2026-11-11T14:20:00Z',
    dataOrigin: 'sample',
    providerResults: [
      {
        providerId: 'google',
        providerName: 'Google DNS',
        dnsServer: '8.8.8.8',
        avgLatencyMs: 24.9,
        minLatencyMs: 20.2,
        maxLatencyMs: 33.1,
        successfulQueries: 10,
        failedQueries: 0,
        totalQueries: 10,
        successRate: 100.0,
        status: 'operational',
        iterations: Array.from({ length: 10 }, (_, i) => ({
          iteration: i + 1,
          latencyMs: Number((21.5 + ((i * 4) % 7) * 1.3).toFixed(1)),
          success: true,
        })),
      },
      {
        providerId: 'cloudflare',
        providerName: 'Cloudflare DNS',
        dnsServer: '1.1.1.1',
        avgLatencyMs: 17.6,
        minLatencyMs: 14.0,
        maxLatencyMs: 24.2,
        successfulQueries: 10,
        failedQueries: 0,
        totalQueries: 10,
        successRate: 100.0,
        status: 'operational',
        iterations: Array.from({ length: 10 }, (_, i) => ({
          iteration: i + 1,
          latencyMs: Number((15.2 + ((i * 3) % 6) * 1.1).toFixed(1)),
          success: true,
        })),
      },
      {
        providerId: 'quad9',
        providerName: 'Quad9 DNS',
        dnsServer: '9.9.9.9',
        avgLatencyMs: 31.2,
        minLatencyMs: 25.8,
        maxLatencyMs: 41.0,
        successfulQueries: 9,
        failedQueries: 1,
        totalQueries: 10,
        successRate: 90.0,
        status: 'degraded',
        iterations: Array.from({ length: 10 }, (_, i) =>
          i === 6
            ? { iteration: i + 1, latencyMs: null, success: false, errorReason: 'Timeout' }
            : {
                iteration: i + 1,
                latencyMs: Number((27.0 + ((i * 5) % 7) * 1.4).toFixed(1)),
                success: true,
              }
        ),
      },
    ],
  },
  {
    experimentId: 'SAMPLE-2026-04',
    domain: 'wikipedia.org',
    queryType: 'A',
    iterations: 5,
    executedAt: '2026-11-10T09:15:00Z',
    dataOrigin: 'sample',
    providerResults: [
      {
        providerId: 'google',
        providerName: 'Google DNS',
        dnsServer: '8.8.8.8',
        avgLatencyMs: 18.4,
        minLatencyMs: 15.1,
        maxLatencyMs: 22.8,
        successfulQueries: 5,
        failedQueries: 0,
        totalQueries: 5,
        successRate: 100.0,
        status: 'operational',
        iterations: [
          { iteration: 1, latencyMs: 22.8, success: true },
          { iteration: 2, latencyMs: 17.6, success: true },
          { iteration: 3, latencyMs: 15.1, success: true },
          { iteration: 4, latencyMs: 18.9, success: true },
          { iteration: 5, latencyMs: 17.6, success: true },
        ],
      },
      {
        providerId: 'cloudflare',
        providerName: 'Cloudflare DNS',
        dnsServer: '1.1.1.1',
        avgLatencyMs: 13.7,
        minLatencyMs: 11.9,
        maxLatencyMs: 16.2,
        successfulQueries: 5,
        failedQueries: 0,
        totalQueries: 5,
        successRate: 100.0,
        status: 'operational',
        iterations: [
          { iteration: 1, latencyMs: 16.2, success: true },
          { iteration: 2, latencyMs: 13.1, success: true },
          { iteration: 3, latencyMs: 11.9, success: true },
          { iteration: 4, latencyMs: 14.0, success: true },
          { iteration: 5, latencyMs: 13.3, success: true },
        ],
      },
      {
        providerId: 'quad9',
        providerName: 'Quad9 DNS',
        dnsServer: '9.9.9.9',
        avgLatencyMs: 23.9,
        minLatencyMs: 20.4,
        maxLatencyMs: 28.5,
        successfulQueries: 5,
        failedQueries: 0,
        totalQueries: 5,
        successRate: 100.0,
        status: 'operational',
        iterations: [
          { iteration: 1, latencyMs: 28.5, success: true },
          { iteration: 2, latencyMs: 22.7, success: true },
          { iteration: 3, latencyMs: 20.4, success: true },
          { iteration: 4, latencyMs: 24.6, success: true },
          { iteration: 5, latencyMs: 23.3, success: true },
        ],
      },
    ],
  },
];

/**
 * Generates a clearly marked sample preview experiment matching the user's
 * selected domain, providers, and iteration count — strictly tagged
 * `dataOrigin: 'sample'` and never reported as a live DNS test.
 */
export function buildSamplePreviewExperiment(
  domain: string,
  providers: Array<'google' | 'cloudflare' | 'quad9'>,
  iterations: 5 | 10 | 20
): BenchmarkExperiment {
  const baseTemplate = SAMPLE_EXPERIMENTS[0];
  const filteredResults = baseTemplate.providerResults
    .filter((res) => providers.includes(res.providerId))
    .map((res) => {
      const slicedIterations = Array.from({ length: iterations }, (_, idx) => {
        const source = res.iterations[idx % res.iterations.length];
        return {
          ...source,
          iteration: idx + 1,
        };
      });
      const successful = slicedIterations.filter((p) => p.success && p.latencyMs !== null);
      const latencies = successful.map((p) => p.latencyMs as number);
      const avgLatencyMs =
        latencies.length > 0
          ? Number((latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2))
          : 0;
      const minLatencyMs = latencies.length > 0 ? Math.min(...latencies) : 0;
      const maxLatencyMs = latencies.length > 0 ? Math.max(...latencies) : 0;
      const successRate = Number(((successful.length / iterations) * 100).toFixed(1));

      return {
        ...res,
        avgLatencyMs,
        minLatencyMs,
        maxLatencyMs,
        successfulQueries: successful.length,
        failedQueries: iterations - successful.length,
        totalQueries: iterations,
        successRate,
        iterations: slicedIterations,
      };
    });

  return {
    experimentId: `SAMPLE-PREVIEW-${Date.now().toString().slice(-4)}`,
    domain,
    queryType: 'A',
    iterations,
    executedAt: new Date().toISOString(),
    dataOrigin: 'sample',
    providerResults: filteredResults,
  };
}
