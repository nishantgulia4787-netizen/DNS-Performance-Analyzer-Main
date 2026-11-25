
import time
import dns.resolver
import dns.exception

DNS_PROVIDERS = {
    "google": {
        "name": "Google DNS",
        "ip": "8.8.8.8"
    },
    "cloudflare": {
        "name": "Cloudflare DNS",
        "ip": "1.1.1.1"
    },
    "quad9": {
        "name": "Quad9 DNS",
        "ip": "9.9.9.9"
    }
}


def query_dns(domain: str, provider_id: str, timeout_ms: int = 2500):
    """
    Perform an actual DNS A-record query
    against the selected DNS provider.
    """

    if provider_id not in DNS_PROVIDERS:
        raise ValueError("Unsupported DNS provider")

    provider = DNS_PROVIDERS[provider_id]

    resolver = dns.resolver.Resolver(configure=False)
    resolver.nameservers = [provider["ip"]]
    resolver.timeout = timeout_ms / 1000
    resolver.lifetime = timeout_ms / 1000
    resolver.cache = None

    start_time = time.perf_counter()

    try:
        answer = resolver.resolve(
            domain,
            "A",
            search=False,
            raise_on_no_answer=True
        )

        latency = (time.perf_counter() - start_time) * 1000

        return {
            "provider_id": provider_id,
            "provider_name": provider["name"],
            "dns_server": provider["ip"],
            "domain": domain,
            "success": True,
            "latency_ms": round(latency, 3),
            "ip_addresses": [record.to_text() for record in answer],
            "error": None
        }

    except (dns.exception.DNSException, OSError, TimeoutError) as error:

        latency = (time.perf_counter() - start_time) * 1000

        return {
            "provider_id": provider_id,
            "provider_name": provider["name"],
            "dns_server": provider["ip"],
            "domain": domain,
            "success": False,
            "latency_ms": round(latency, 3),
            "ip_addresses": [],
            "error": str(error)
        }
