@echo off
echo Setting up Walmart AI/ML Fraud Detection System...

:: Create virtual environment if it doesn't exist
if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
)

:: Activate virtual environment
echo Activating virtual environment...
call .venv\Scripts\activate.bat

:: Install PyTorch first
echo Installing PyTorch...
uv pip install torch

:: Install PyTorch Geometric dependencies
echo Installing PyTorch Geometric dependencies...
uv pip install torch-scatter torch-sparse torch-cluster torch-spline-conv torch-geometric -f https://data.pyg.org/whl/torch-2.0.0+cpu.html

:: Install the project dependencies
echo Installing project dependencies...
uv pip install -r requirements.txt

:: Set up PYTHONPATH
echo Setting up PYTHONPATH...
set PYTHONPATH=%CD%

echo Setup complete! You can now run the server with:
echo python -m api.server

pause 