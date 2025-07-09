from __future__ import annotations

"""Lightweight GNN that assigns a risk score (0-1) to each detected fraud ring.
This is *hackathon-grade* – weights are random unless you call `fit` with labeled
examples. Uses PyTorch Geometric (GraphConv + global mean pooling)."""

from typing import List, Tuple

import networkx as nx
import numpy as np
import torch  # type: ignore
from torch_geometric.data import Data, DataLoader  # type: ignore
from torch_geometric.nn import GATConv, global_mean_pool  # type: ignore
import pandas as pd

__all__ = ["RingRiskGNN", "cycle_to_data", "score_rings"]


def cycle_to_data(g: nx.DiGraph, cycle: Tuple[str, ...]) -> Data:  # type: ignore[name-defined]
    """Extract subgraph for *cycle* and convert to PyG Data object."""
    sub = g.subgraph(cycle).to_undirected()
    mapping = {n: i for i, n in enumerate(sub.nodes())}
    # Node features: degrees (1-dim) for demo – shape [num_nodes, 1]
    x = torch.tensor([[sub.degree[n]] for n in sub.nodes()], dtype=torch.float)

    # Edges
    edges = list(sub.edges())
    if not edges:
        edge_index = torch.empty((2, 0), dtype=torch.long)
    else:
        edge_index = torch.tensor([[mapping[u] for u, v in edges], [mapping[v] for u, v in edges]], dtype=torch.long)
    data = Data(x=x, edge_index=edge_index)
    return data


class RingRiskGNN(torch.nn.Module):  # type: ignore[misc]
    def __init__(self, hidden: int = 32, heads: int = 4, dropout: float = 0.1):
        super().__init__()
        # Use Graph Attention Networks (GAT) for interpretability
        self.gat1 = GATConv(1, hidden, heads=heads, dropout=dropout)
        self.gat2 = GATConv(hidden * heads, hidden, heads=1, dropout=dropout)
        self.lin = torch.nn.Linear(hidden, 1)
        self.dropout = torch.nn.Dropout(dropout)

    def forward(self, data: Data):  # type: ignore[override]
        x, edge_index, batch = data.x, data.edge_index, data.batch
        
        # GAT layers with residual connections
        x1 = torch.relu(self.gat1(x, edge_index))
        x1 = self.dropout(x1)
        x2 = torch.relu(self.gat2(x1, edge_index))
        
        # Global pooling
        x = global_mean_pool(x2, batch)
        return torch.sigmoid(self.lin(x)).squeeze(-1)

    def get_attention_weights(self, data: Data):  # type: ignore[override]
        """Return attention weights for interpretability."""
        x, edge_index = data.x, data.edge_index
        _, attention = self.gat1(x, edge_index, return_attention_weights=True)
        return attention


@torch.no_grad()
def score_rings(g: nx.DiGraph, cycles: List[Tuple[str, ...]], model: RingRiskGNN | None = None) -> List[float]:  # type: ignore[override]
    """Return risk scores for each *cycle* using **model** (random-weights if None)."""
    if model is None:
        model = RingRiskGNN()
    model.eval()
    device = next(model.parameters()).device if next(model.parameters()).is_cuda else "cpu"
    scores: List[float] = []
    for cyc in cycles:
        data = cycle_to_data(g, cyc)
        data.batch = torch.zeros(data.num_nodes, dtype=torch.long)
        out = model(data.to(device))
        scores.append(float(out.item()))
    return scores 


def prepare_training_data(fraud_rings_path: str = "data/fraud_rings.jsonl") -> List[Data]:  # type: ignore[name-defined]
    """Prepare labeled training data from fraud rings dataset."""
    try:
        from cortex.fraud_detection import FraudDetector
        
        df = FraudDetector.load_jsonl(fraud_rings_path)
        data_list = []
        
        # Group by ring_id to create individual ring graphs
        for ring_id, ring_df in df.groupby("ring_id"):
            if len(ring_df) < 3:  # Skip tiny rings
                continue
                
            # Create subgraph for this ring
            g = nx.DiGraph()
            for _, row in ring_df.iterrows():
                g.add_edge(row["source_id"], row["target_id"], amount=row["amount"])
            
            if len(g.nodes()) < 3:
                continue
                
            # Convert to PyG data
            mapping = {n: i for i, n in enumerate(g.nodes())}
            x = torch.tensor([[g.degree[n]] for n in g.nodes()], dtype=torch.float)
            
            edges = list(g.edges())
            if edges:
                edge_index = torch.tensor([
                    [mapping[u] for u, v in edges], 
                    [mapping[v] for u, v in edges]
                ], dtype=torch.long)
            else:
                edge_index = torch.empty((2, 0), dtype=torch.long)
            
            # Label: 1 for fraud rings, 0 for legitimate
            y = torch.tensor([1.0 if ring_df.iloc[0].get("is_fraud", False) else 0.0])
            
            data = Data(x=x, edge_index=edge_index, y=y)
            data_list.append(data)
        
        return data_list
        
    except Exception as e:
        print(f"Failed to load training data: {e}")
        return []


def train_gnn_model(data_list: List[Data], epochs: int = 50) -> RingRiskGNN:  # type: ignore[name-defined]
    """Train the GNN model on labeled fraud ring data."""
    if not data_list:
        print("No training data available, returning untrained model")
        return RingRiskGNN()
    
    model = RingRiskGNN()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
    criterion = torch.nn.BCELoss()
    
    # Split data
    train_size = int(0.8 * len(data_list))
    train_data = data_list[:train_size]
    val_data = data_list[train_size:]
    
    if not train_data:
        return model
    
    train_loader = DataLoader(train_data, batch_size=4, shuffle=True)
    
    model.train()
    for epoch in range(epochs):
        total_loss = 0
        for batch in train_loader:
            optimizer.zero_grad()
            out = model(batch)
            loss = criterion(out, batch.y)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        
        if epoch % 10 == 0:
            avg_loss = total_loss / len(train_loader)
            print(f"[GNN Training] Epoch {epoch}/{epochs}, Loss: {avg_loss:.4f}")
    
    return model 