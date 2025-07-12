from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Union, Dict, Any

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import IsolationForest
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

NUMERIC_TYPES = ["int64", "float64", "int32", "float32"]


@dataclass
class FraudDetector:
    """Light-weight wrapper around sklearn IsolationForest to flag anomalous retail
    transactions. Designed for hackathon speed rather than production-grade
    performance. The model can be trained on historical *non-fraud* transactions
    and will highlight outliers at prediction time.
    """

    contamination: float = 0.01  # Expected fraction of fraud in the dataset
    random_state: int = 42
    _model: Pipeline | None = field(init=False, default=None)
    _fitted: bool = field(init=False, default=False)

    def _build_pipeline(self, df: pd.DataFrame) -> Pipeline:
        """Create an sklearn Pipeline with basic preprocessing + IsolationForest."""
        numeric_cols: List[str] = [c for c in df.columns if df[c].dtype.name in NUMERIC_TYPES]
        categorical_cols: List[str] = [c for c in df.columns if c not in numeric_cols]

        numeric_transformer = StandardScaler()
        categorical_transformer = OneHotEncoder(handle_unknown="ignore", sparse_output=False) 

        preprocessor = ColumnTransformer(
            transformers=[
                ("num", numeric_transformer, numeric_cols),
                ("cat", categorical_transformer, categorical_cols),
            ]
        )

        iforest = IsolationForest(
            contamination='auto',  # Let sklearn auto-detect contamination
            random_state=self.random_state,
            n_estimators=200,
            n_jobs=-1,
        )

        pipeline = Pipeline([
            ("pre", preprocessor),
            ("clf", iforest),
        ])
        return pipeline

    # ---------------------------------------------------------------------
    # Public API
    # ---------------------------------------------------------------------
    def fit(self, df: pd.DataFrame) -> "FraudDetector":
        """Fit the detector on a dataframe of *legitimate* transactions."""
        if df.empty:
            raise ValueError("Training dataframe is empty")

        self._model = self._build_pipeline(df)
        self._model.fit(df)
        self._fitted = True
        return self

    def predict(self, df: pd.DataFrame) -> np.ndarray:
        """Return anomaly scores (+1 normal, -1 anomaly) for each row."""
        if not self._fitted or self._model is None:
            raise RuntimeError("Model must be fitted before calling predict()")
        return self._model.predict(df)

    def score_samples(self, df: pd.DataFrame) -> np.ndarray:
        """Return the raw anomaly scores (the lower, the more abnormal)."""
        if not self._fitted or self._model is None:
            raise RuntimeError("Model must be fitted before calling score_samples()")
        return self._model.score_samples(df)

    # ------------------------------------------------------------------
    # Convenience helpers for JSON I/O (hackathon-friendly)
    # ------------------------------------------------------------------
    @staticmethod
    def load_jsonl(path: Union[str, Path]) -> pd.DataFrame:
        """Read transactions from a .jsonl (one-JSON-object-per-line) file."""
        records: List[Dict[str, Any]] = []
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    records.append(json.loads(line))
        return pd.DataFrame.from_records(records)

    @staticmethod
    def save_scores(df: pd.DataFrame, scores: np.ndarray, out_path: Union[str, Path]):
        """Persist dataframe with an additional `fraud_score` column as CSV."""
        df_out = df.copy()
        df_out["fraud_score"] = scores
        df_out.to_csv(out_path, index=False) 