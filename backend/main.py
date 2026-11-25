
import uuid
from typing import Literal

from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from benchmark import run_benchmark
from storage import (
    initialize_database,
    save_experiment,
    get_all_experiments
)


app = FastAPI(
    title="DNS Performance Analyzer API",
    description="Live DNS benchmarking engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Active jobs remain in memory.
jobs = {}


@app.on_event("startup")
def startup():
    initialize_database()


class BenchmarkRequest(BaseModel):
    domain: str = Field(min_length=1, max_length=253)

    providers: list[
        Literal["google", "cloudflare", "quad9"]
    ] = Field(min_length=1)

    iterations: Literal[5, 10, 20]

    query_type: Literal["A"] = "A"

    timeout_ms: int = Field(default=2500, ge=500, le=10000)


def execute_benchmark(job_id, request):
    job = jobs[job_id]

    job["status"] = "running"

    def update_progress(completed, total, provider_name):
        job["completedQueries"] = completed
        job["totalQueries"] = total
        job["currentProvider"] = provider_name

    try:
        experiment = run_benchmark(
            domain=request.domain,
            providers=request.providers,
            iterations=request.iterations,
            query_type=request.query_type,
            timeout_ms=request.timeout_ms,
            progress_callback=update_progress
        )

        # Save completed experiment permanently.
        save_experiment(experiment)

        job["status"] = "completed"
        job["completedQueries"] = job["totalQueries"]
        job["currentProvider"] = None
        job["experiment"] = experiment

    except Exception as error:
        job["status"] = "failed"
        job["errorMessage"] = str(error)


@app.get("/")
def root():
    return {
        "message": "DNS Performance Analyzer API is running",
        "status": "operational"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/api/benchmark")
def start_benchmark(
    request: BenchmarkRequest,
    background_tasks: BackgroundTasks
):
    job_id = str(uuid.uuid4())

    total = len(request.providers) * request.iterations

    jobs[job_id] = {
        "jobId": job_id,
        "status": "queued",
        "completedQueries": 0,
        "totalQueries": total,
        "currentProvider": None,
        "errorMessage": None,
        "experiment": None
    }

    background_tasks.add_task(
        execute_benchmark,
        job_id,
        request
    )

    return jobs[job_id]


@app.get("/api/results")
def get_results(id: str | None = None):

    if id:
        if id not in jobs:
            raise HTTPException(
                status_code=404,
                detail="Benchmark job not found"
            )

        return jobs[id]

    if not jobs:
        raise HTTPException(
            status_code=404,
            detail="No benchmark jobs found"
        )

    latest_job = next(reversed(jobs.values()))
    return latest_job


@app.get("/api/history")
def get_history():
    return get_all_experiments()
