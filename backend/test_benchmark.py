
from benchmark import run_benchmark
import json

result = run_benchmark(
    domain="google.com",
    providers=["google", "cloudflare", "quad9"],
    iterations=5,
    query_type="A"
)

print("\n========== BENCHMARK RESULTS ==========\n")

for provider in result["providerResults"]:
    print("Provider:", provider["providerName"])
    print("Average:", provider["avgLatencyMs"], "ms")
    print("Minimum:", provider["minLatencyMs"], "ms")
    print("Maximum:", provider["maxLatencyMs"], "ms")
    print("Success Rate:", provider["successRate"], "%")
    print("Status:", provider["status"])
    print("--------------------------------------")

print("\nExperiment ID:", result["experimentId"])
print("\n========== COMPLETED ==========\n")

with open("benchmark_output.json", "w") as file:
    json.dump(result, file, indent=4)

print("Full results saved to benchmark_output.json")
