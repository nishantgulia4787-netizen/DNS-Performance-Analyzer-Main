
from datetime import datetime, timezone
from uuid import uuid4

from dns_engine import DNS_PROVIDERS, query_dns
from analysis import calculate_provider_statistics


def run_benchmark(
    domain,
    providers,
    iterations=10,
    query_type="A",
    timeout_ms=2500,
    progress_callback=None
):
    domain = domain.strip().rstrip(".")

    if not domain or "://" in domain or "/" in domain:
        raise ValueError("Enter a valid domain name.")

    if not providers:
        raise ValueError("Select at least one DNS provider.")

    if iterations not in (5, 10, 20):
        raise ValueError("Iterations must be 5, 10 or 20.")

    if query_type != "A":
        raise ValueError("Only A record queries are supported currently.")

    if len(set(providers)) != len(providers):
        raise ValueError("Duplicate DNS providers are not allowed.")

    for provider in providers:
        if provider not in DNS_PROVIDERS:
            raise ValueError(f"Unsupported provider: {provider}")

    total_queries = len(providers) * iterations
    completed_queries = 0
    provider_results = []

    for provider_id in providers:
        raw_results = []

        for _ in range(iterations):
            result = query_dns(
                domain,
                provider_id,
                timeout_ms
            )

            raw_results.append(result)
            completed_queries += 1

            # Report progress after every DNS query.
            if progress_callback:
                progress_callback(
                    completed_queries,
                    total_queries,
                    DNS_PROVIDERS[provider_id]["name"]
                )

        summary = calculate_provider_statistics(
            provider_id,
            raw_results
        )

        provider_results.append(summary)

    return {
        "experimentId": str(uuid4()),
        "domain": domain,
        "queryType": query_type,
        "iterations": iterations,
        "executedAt": datetime.now(timezone.utc).isoformat(),
        "dataOrigin": "live",
        "providerResults": provider_results
    }
