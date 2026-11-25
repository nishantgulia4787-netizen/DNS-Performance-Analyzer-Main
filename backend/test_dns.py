
from dns_engine import query_dns

domain = "google.com"

providers = ["google", "cloudflare", "quad9"]

print("\n========== DNS PERFORMANCE TEST ==========\n")

for provider in providers:

    result = query_dns(domain, provider)

    print("Provider:", result["provider_name"])
    print("DNS Server:", result["dns_server"])
    print("Success:", result["success"])
    print("Latency:", result["latency_ms"], "ms")
    print("IP Addresses:", result["ip_addresses"])
    print("Error:", result["error"])
    print("------------------------------------------")

print("\n========== TEST COMPLETED ==========\n")
