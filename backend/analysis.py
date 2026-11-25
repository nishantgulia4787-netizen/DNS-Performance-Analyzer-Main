
from dns_engine import DNS_PROVIDERS


def calculate_provider_statistics(provider_id, results):
    provider = DNS_PROVIDERS[provider_id]

    successful = [
        result["latency_ms"]
        for result in results
        if result["success"]
    ]

    total = len(results)
    success_count = len(successful)
    failed_count = total - success_count

    success_rate = (
        (success_count / total) * 100
        if total else 0
    )

    if success_rate >= 80:
        status = "operational"
    elif success_count > 0:
        status = "degraded"
    else:
        status = "unreachable"

    return {
        "providerId": provider_id,
        "providerName": provider["name"],
        "dnsServer": provider["ip"],
        "avgLatencyMs": round(sum(successful) / len(successful), 3) if successful else 0,
        "minLatencyMs": round(min(successful), 3) if successful else 0,
        "maxLatencyMs": round(max(successful), 3) if successful else 0,
        "successfulQueries": success_count,
        "failedQueries": failed_count,
        "totalQueries": total,
        "successRate": round(success_rate, 2),
        "status": status,
        "iterations": [
            {
                "iteration": index,
                "latencyMs": result["latency_ms"] if result["success"] else None,
                "success": result["success"],
                "errorReason": result["error"]
            }
            for index, result in enumerate(results, start=1)
        ]
    }
