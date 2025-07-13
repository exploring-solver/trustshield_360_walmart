from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Tuple

import numpy as np
import pandas as pd
import torch  # type: ignore
from tab_transformer_pytorch import TabTransformer  # type: ignore

__all__ = ["TabTransformerDetector"]


@dataclass
class TabTransformerDetector:
    """TabTransformer-based fraud detector for tabular transaction data.

    This is **experimental** – intended for hackathon prototyping only. The
    model is trained entirely in-memory and is *not* optimised for large data.
    """

    epochs: int = 5
    lr: float = 1e-3
    batch_size: int = 256
    device: str = "cuda" if torch.cuda.is_available() else "cpu"
    _model: TabTransformer | None = field(init=False, default=None)
    _cat_cols: List[str] = field(init=False, default_factory=list)
    _cont_cols: List[str] = field(init=False, default_factory=list)
    _cat_sizes: Tuple[int, ...] = field(init=False, default=())
    _fitted: bool = field(init=False, default=False)

    # ------------------------------------------------------------------
    # Public
    # ------------------------------------------------------------------
    def fit(self, df: pd.DataFrame, label_col: str | None = None) -> "TabTransformerDetector":
        """Fit the model on *legitimate* transactions only.

        If `label_col` is provided, supervised training is done; otherwise the
        model is trained as an auto-encoder by predicting a dummy zero vector.
        """
        self._identify_columns(df)
        x_categ, x_cont = self._preprocess(df)

        if label_col and label_col in df.columns:
            y = torch.tensor(df[label_col].values, dtype=torch.float32)
        else:
            y = torch.zeros(len(df), 1)

        self._build_model()
        assert self._model is not None  # reassure type checker
        self._model.to(self.device)

        dataset = torch.utils.data.TensorDataset(x_categ, x_cont, y)
        loader = torch.utils.data.DataLoader(dataset, batch_size=self.batch_size, shuffle=True, drop_last=False)

        optim = torch.optim.Adam(self._model.parameters(), lr=self.lr)  # type: ignore[arg-type]
        loss_fn = torch.nn.MSELoss()

        self._model.train()
        for epoch in range(self.epochs):
            total = 0.0
            for xc, xn, tgt in loader:
                xc, xn, tgt = xc.to(self.device), xn.to(self.device), tgt.to(self.device)
                pred = self._model(xc, xn)
                loss = loss_fn(pred, tgt)
                optim.zero_grad()
                loss.backward()
                optim.step()
                total += loss.item() * len(xc)
            print(f"[TabTransformer] epoch {epoch+1}/{self.epochs} loss={total/len(df):.4f}")

        self._fitted = True
        return self

    @torch.no_grad()
    def predict_score(self, df: pd.DataFrame) -> np.ndarray:
        """Return reconstruction error (MSE) as anomaly score."""
        if not self._fitted:
            raise RuntimeError("Model not fitted")
        assert self._model is not None
        self._model.eval()
        x_categ, x_cont = self._preprocess(df)
        preds = self._model(x_categ.to(self.device), x_cont.to(self.device))
        errs = torch.mean((preds.cpu() - 0) ** 2, dim=1)  # residual vs zeros
        return errs.numpy()

    # ------------------------------------------------------------------
    # Internals
    # ------------------------------------------------------------------
    def _identify_columns(self, df: pd.DataFrame):
        self._cat_cols = [
            c for c in df.columns
            if (df[c].dtype == "object" or df[c].dtype.name == "category")
            and not pd.api.types.is_datetime64_any_dtype(df[c])  # Exclude datetime
        ]
        self._cont_cols = [
            c for c in df.columns
            if c not in self._cat_cols and not pd.api.types.is_datetime64_any_dtype(df[c])
        ]
        self._cat_sizes = tuple(int(df[c].astype("category").nunique()) + 1 for c in self._cat_cols)


    def _preprocess(self, df: pd.DataFrame) -> Tuple[torch.Tensor, torch.Tensor]:
        # categorical to codes (missing -> last index)
        cat_tensors = []
        for c in self._cat_cols:
            codes = df[c].astype("category").cat.codes.replace(-1, len(pd.unique(df[c]))).values
            cat_tensors.append(torch.tensor(codes, dtype=torch.long))
        x_categ = torch.stack(cat_tensors, dim=1) if cat_tensors else torch.empty(len(df), 0, dtype=torch.long)

        # continuous features – ensure float32
        x_cont = torch.tensor(df[self._cont_cols].values, dtype=torch.float32)
        return x_categ, x_cont

    def _build_model(self):
        num_cont = len(self._cont_cols)
        self._model = TabTransformer(
            categories=self._cat_sizes,
            num_continuous=num_cont,
            dim=32,
            dim_out=1,
            depth=6,
            heads=8,
            attn_dropout=0.1,
            ff_dropout=0.1,
        ) 