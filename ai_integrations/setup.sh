#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up Walmart AI/ML Fraud Detection System...${NC}"

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo -e "${GREEN}Creating virtual environment...${NC}"
    python -m venv .venv
fi

# Activate virtual environment
echo -e "${GREEN}Activating virtual environment...${NC}"
source .venv/bin/activate

# Install PyTorch first
echo -e "${GREEN}Installing PyTorch...${NC}"
uv pip install torch

# Install PyTorch Geometric dependencies
echo -e "${GREEN}Installing PyTorch Geometric dependencies...${NC}"
uv pip install torch-scatter torch-sparse torch-cluster torch-spline-conv torch-geometric -f https://data.pyg.org/whl/torch-2.0.0+cpu.html

# Install the project dependencies
echo -e "${GREEN}Installing project dependencies...${NC}"
uv pip install -r requirements.txt

# Set up PYTHONPATH
REPO_PATH=$(pwd)
echo -e "${GREEN}Setting up PYTHONPATH...${NC}"
export PYTHONPATH=$REPO_PATH

echo -e "${BLUE}Setup complete! You can now run the server with:${NC}"
echo -e "${GREEN}python -m api.server${NC}" 