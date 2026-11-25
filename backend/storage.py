
import sqlite3
import json
from pathlib import Path

DB_PATH = Path(__file__).parent / "data" / "experiments.db"


def get_connection():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    with get_connection() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS experiments (
                experiment_id TEXT PRIMARY KEY,
                domain TEXT NOT NULL,
                executed_at TEXT NOT NULL,
                data_json TEXT NOT NULL
            )
        """)


def save_experiment(experiment):
    with get_connection() as connection:
        connection.execute("""
            INSERT OR REPLACE INTO experiments
            (experiment_id, domain, executed_at, data_json)
            VALUES (?, ?, ?, ?)
        """, (
            experiment["experimentId"],
            experiment["domain"],
            experiment["executedAt"],
            json.dumps(experiment)
        ))


def get_all_experiments():
    with get_connection() as connection:
        rows = connection.execute("""
            SELECT data_json
            FROM experiments
            ORDER BY executed_at DESC
        """).fetchall()

    return [json.loads(row["data_json"]) for row in rows]


def get_experiment(experiment_id):
    with get_connection() as connection:
        row = connection.execute("""
            SELECT data_json
            FROM experiments
            WHERE experiment_id = ?
        """, (experiment_id,)).fetchone()

    return json.loads(row["data_json"]) if row else None
