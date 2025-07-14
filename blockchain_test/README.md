# Blockchain Test Suite for Walmart Cybersecurity

This project contains smart contracts and scripts for secure transaction logging and risk scoring, as part of the Walmart TrustShield 360 platform.

## Overview

- **TransactionLedger.sol**: Logs transactions with risk scores, verifier addresses, and timestamps. Used for immutable, auditable storage of transaction risk data.

## Usage

### Install dependencies
```bash
npm install
```

### Common Hardhat Commands
```bash
# Show Hardhat help
npx hardhat help

# Run tests
npx hardhat test

# Run tests with gas reporting
env REPORT_GAS=true npx hardhat test

# Start a local node
npx hardhat node

# Deploy contracts (example)
npx hardhat run scripts/deploy.ts --network localhost
```

### Contract Summaries

#### TransactionLedger.sol
- Log transactions with a unique ID, amount, risk score, and verifier address.
- Retrieve transaction details by ID.
- Emits events for each logged transaction.


---

For more details, see the contract files in `contracts/` and scripts in `scripts/`.

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
# npx hardhat ignition deploy ./ignition/modules/Lock.ts
npx hardhat run scripts/deploy.ts --network localhost
```

> Built by Team Agesis 360 for Walmart Sparkathon'25.