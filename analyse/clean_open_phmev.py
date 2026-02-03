"""Utilities for cleaning and summarising the OPEN_PHMEV_2024 dataset.

The script reads the very large CSV delivered by Assurance Maladie, keeps the
columns that describe the ATC (Anatomical Therapeutic Chemical) classification
of each medicine, and aggregates dispensing volumes at different ATC levels.

Running the module as a script will produce two CSV files in ``data/processed``:
- ``medications_by_atc5.csv``: metrics grouped by the most granular ATC level.
- ``medications_by_atc1.csv``: high-level view grouped by the top ATC class.

Both outputs include the total number of boxes (``boites``), the reimbursed
amount (``rem``) and the base de sécurité sociale (``bse``).
"""

from __future__ import annotations

from pathlib import Path
from typing import Iterable

import pandas as pd

ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT_DIR / "data"
RAW_FILE = DATA_DIR / "OPEN_PHMEV_2024.CSV"
OUTPUT_DIR = DATA_DIR / "processed"

# Raw column names as delivered in the source file.
RAW_COLUMNS: tuple[str, ...] = (
    "atc1",
    "l_atc1",
    "atc2",
    "L_ATC2",
    "atc3",
    "L_ATC3",
    "atc4",
    "L_ATC4",
    "ATC5",
    "L_ATC5",
    "BOITES",
    "REM",
    "BSE",
)

# Harmonised column names for downstream usage.
RENAME_MAP: dict[str, str] = {
    "atc1": "atc1",
    "l_atc1": "atc1_label",
    "atc2": "atc2",
    "L_ATC2": "atc2_label",
    "atc3": "atc3",
    "L_ATC3": "atc3_label",
    "atc4": "atc4",
    "L_ATC4": "atc4_label",
    "ATC5": "atc5",
    "L_ATC5": "atc5_label",
    "BOITES": "boites",
    "REM": "rem",
    "BSE": "bse",
}

NUMERIC_COLUMNS: tuple[str, ...] = ("boites", "rem", "bse")
ATC_COLUMNS: tuple[str, ...] = (
    "atc1",
    "atc1_label",
    "atc2",
    "atc2_label",
    "atc3",
    "atc3_label",
    "atc4",
    "atc4_label",
    "atc5",
    "atc5_label",
)

def _prepare_chunk(chunk: pd.DataFrame) -> pd.DataFrame:
    """Clean a raw chunk from the CSV file.

    - Keep only the columns required for the aggregation.
    - Harmonise column names.
    - Convert the three numeric metrics to floating point numbers, handling
      French decimal separators (``","``).
    """

    chunk = chunk.rename(columns=RENAME_MAP)

    for column in NUMERIC_COLUMNS:
        chunk[column] = (
            chunk[column]
            .astype(str)
            .str.replace(" ", "", regex=False)
            .str.replace(",", ".", regex=False)
        )
        chunk[column] = pd.to_numeric(chunk[column], errors="coerce").fillna(0.0)

    return chunk

def _aggregate(chunk: pd.DataFrame) -> pd.DataFrame:
    """Aggregate dispensing metrics at the ATC5 level for a single chunk."""

    metrics = chunk.groupby(list(ATC_COLUMNS), dropna=False)[list(NUMERIC_COLUMNS)].sum()
    return metrics

def aggregate_open_phmev(
    *,
    source_path: Path = RAW_FILE,
    output_dir: Path = OUTPUT_DIR,
    chunksize: int = 500_000,
    encoding: str = "latin-1",
) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Aggregate the OPEN_PHMEV_2024 dataset by medicine categories.

    Parameters
    ----------
    source_path:
        Path to the raw CSV file to process.
    output_dir:
        Directory in which the summary CSV files will be saved.
    chunksize:
        Number of rows to load into memory at once. Tune this depending on the
        machine's RAM.
    encoding:
        Text encoding of the CSV file. Defaults to ``latin-1`` which matches the
        standard delivery of OPEN_PHMEV files.

    Returns
    -------
    tuple[pandas.DataFrame, pandas.DataFrame]
        DataFrames representing the ATC5- and ATC1-level aggregations.
    """

    if not source_path.exists():
        raise FileNotFoundError(f"Raw file not found: {source_path}")

    output_dir.mkdir(parents=True, exist_ok=True)

    aggregated: pd.DataFrame | None = None

    reader = pd.read_csv(
        source_path,
        sep=";",
        usecols=list(RAW_COLUMNS),
        dtype=str,
        chunksize=chunksize,
        encoding=encoding,
        low_memory=False,
    )

    for chunk in reader:
        prepared = _prepare_chunk(chunk)
        aggregated_chunk = _aggregate(prepared)
        if aggregated is None:
            aggregated = aggregated_chunk
        else:
            aggregated = aggregated.add(aggregated_chunk, fill_value=0.0)

    if aggregated is None:
        raise ValueError("No data found in the source file.")

    aggregated = aggregated.reset_index()

    atc5_summary = aggregated.copy()

    atc1_summary = (
        aggregated.groupby(["atc1", "atc1_label"], dropna=False)[list(NUMERIC_COLUMNS)]
        .sum()
        .reset_index()
        .sort_values("boites", ascending=False)
    )

    atc5_path = output_dir / "medications_by_atc5.csv"
    atc1_path = output_dir / "medications_by_atc1.csv"

    atc5_summary.to_csv(atc5_path, index=False)
    atc1_summary.to_csv(atc1_path, index=False)

    return atc5_summary, atc1_summary

def main() -> None:
    """Command-line entry point."""

    atc5_summary, atc1_summary = aggregate_open_phmev()

    print(f"Saved ATC5 summary with {len(atc5_summary)} rows to {OUTPUT_DIR/'medications_by_atc5.csv'}")
    print(f"Saved ATC1 summary with {len(atc1_summary)} rows to {OUTPUT_DIR/'medications_by_atc1.csv'}")

if __name__ == "__main__":
    main()
