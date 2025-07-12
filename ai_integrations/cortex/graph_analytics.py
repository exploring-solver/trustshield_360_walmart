from __future__ import annotations

from typing import List, Dict, Any, Tuple

import networkx as nx
import pandas as pd


def build_transaction_graph(df: pd.DataFrame) -> nx.DiGraph:
    """Create a directed graph where nodes are account IDs and edges represent
    monetary transactions. Assumes the dataframe has `source_id`, `target_id`, and
    `amount` columns.
    """
    if not {"source_id", "target_id"}.issubset(df.columns):
        raise ValueError("DataFrame must contain `source_id` and `target_id` columns")

    g = nx.DiGraph()

    for _, row in df.iterrows():
        src = row["source_id"]
        tgt = row["target_id"]
        amt = row.get("amount", 0.0)
        g.add_edge(src, tgt, amount=amt)
    return g


def detect_fraud_rings(g: nx.DiGraph, min_cycle_len: int = 3) -> List[Tuple[Any, ...]]:
    """Return a list of simple cycles (potential fraud rings) of at least
    `min_cycle_len` nodes.
    """
    cycles = [c for c in nx.simple_cycles(g) if len(c) >= min_cycle_len]
    return cycles


def ring_stats(cycles: List[Tuple[Any, ...]]) -> Dict[str, Any]:
    """Basic statistics about detected rings for dashboard display."""
    return {
        "ring_count": len(cycles),
        "largest_ring": max((len(c) for c in cycles), default=0),
        "rings": cycles,
    } 