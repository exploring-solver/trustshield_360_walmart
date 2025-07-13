# TrustShield CLI

A powerful command-line interface for Walmart's TrustShield 360 Security Platform. This CLI provides direct access to security features including transaction tracing, risk analysis, credential management, and real-time monitoring.

## Features

- 🔍 **Transaction Tracing**: Trace transactions through the security pipeline
- 🧠 **AI Risk Analysis**: Get AI-powered fraud detection insights
- 🔐 **Credential Management**: Issue and revoke verifiable credentials
- 💳 **Wallet Management**: Check wallet status and freeze/unfreeze accounts
- 📊 **Real-time Monitoring**: Monitor live security events
- 🎨 **Beautiful Output**: Color-coded, formatted terminal output

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- TrustShield 360 Web Application running on `http://localhost:3000`

## Installation

### Option 1: Local Development Setup

1. **Clone and navigate to the CLI directory:**
   ```bash
   cd trustshield-cli
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the TypeScript code:**
   ```bash
   npm run build
   ```

4. **Run the CLI:**
   ```bash
   # Using npm script
   npm run cli
   
   # Or directly with node
   node dist/cli.js
   ```

### Option 2: Global Installation

1. **Install globally:**
   ```bash
   npm install -g .
   ```

2. **Run from anywhere:**
   ```bash
   trustshield --help
   ```

### Option 3: Development with Hot Reload

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run in development mode:**
   ```bash
   npm run dev
   ```

3. **Watch for changes:**
   ```bash
   npm run watch
   ```

## Usage

### Basic Commands

```bash
# Show help
trustshield --help

# Show version
trustshield --version

# Show help for a specific command
trustshield trace --help
```

### Transaction Tracing

Trace a transaction through the security pipeline:

```bash
# Basic trace
trustshield trace --tx TX12345

# Verbose trace with detailed information
trustshield trace --tx TX12345 --verbose
```

**Output includes:**
- Transaction details (ID, amount, status)
- Security pipeline steps with success/failure status
- Risk analysis scores
- Blockchain verification details

### Risk Analysis

Analyze risk factors for transactions or users:

```bash
# Analyze transaction risk
trustshield risk --tx TX12345

# Analyze user risk
trustshield risk --user user-12345
```

**Output includes:**
- Overall risk score and level
- AI fraud cortex analysis
- Risk factors with impact percentages
- TabTransformer and GNN scores
- Recommendations

### Credential Management

Manage verifiable credentials:

```bash
# Revoke a credential (with confirmation)
trustshield revoke --vc cred-12345 --reason "Suspicious activity"

# Force revoke without confirmation
trustshield revoke --vc cred-12345 --reason "Admin action" --force
```

### Wallet Management

Check and manage wallet status:

```bash
# Check wallet status
trustshield wallet --user user-12345

# Freeze a wallet
trustshield wallet --user user-12345 --freeze

# Unfreeze a wallet
trustshield wallet --user user-12345 --unfreeze
```

### Real-time Monitoring

Monitor live security events:

```bash
# Monitor all events
trustshield monitor

# Filter by event type
trustshield monitor --filter fraud
trustshield monitor --filter quantum
trustshield monitor --filter blockchain
```

## Configuration

### Environment Variables

The CLI connects to the TrustShield API at `http://localhost:3000/api` by default. You can modify this by setting environment variables:

```bash
# Set custom API base URL
export TRUSTSHIELD_API_BASE="https://your-api-domain.com/api"

# Or modify the API_BASE constant in index.ts
```

### API Endpoints

The CLI interacts with these API endpoints:

- `GET /api/trace/{txId}` - Transaction tracing
- `GET /api/risk/transaction/{txId}` - Transaction risk analysis
- `GET /api/risk/user/{userId}` - User risk analysis
- `POST /api/credentials/revoke` - Revoke credentials
- `GET /api/wallet/{userId}` - Get wallet status
- `POST /api/wallet/freeze` - Freeze wallet
- `POST /api/wallet/unfreeze` - Unfreeze wallet

## Examples

### Complete Security Investigation

```bash
# 1. Trace a suspicious transaction
trustshield trace --tx TX98765 --verbose

# 2. Analyze risk factors
trustshield risk --tx TX98765

# 3. Check user wallet status
trustshield wallet --user user-98765

# 4. Monitor for related events
trustshield monitor --filter fraud
```

### Credential Security Workflow

```bash
# 1. Check if credentials are compromised
trustshield risk --user user-12345

# 2. Revoke suspicious credentials
trustshield revoke --vc cred-12345 --reason "Compromised account" --force

# 3. Freeze associated wallet
trustshield wallet --user user-12345 --freeze
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   ```
   ❌ Error: connect ECONNREFUSED 127.0.0.1:3000
   ```
   **Solution:** Ensure the TrustShield web application is running on port 3000

2. **API Endpoint Not Found**
   ```
   ❌ Error: Request failed with status code 404
   ```
   **Solution:** Check that the API endpoints are properly implemented in the web application

3. **TypeScript Compilation Errors**
   ```
   ❌ Error: Cannot find module 'commander'
   ```
   **Solution:** Run `npm install` to install dependencies

### Debug Mode

Enable detailed logging by setting the `DEBUG` environment variable:

```bash
DEBUG=* trustshield trace --tx TX12345
```

### Log Files

The CLI outputs detailed logs to help with debugging:

- API request/response logs
- Error stack traces
- Performance metrics

## Development

### Project Structure

```
trustshield-cli/
├── src/
│   ├── index.ts     # Main CLI implementation
│   └── cli.ts       # Entry point for global installation
├── dist/            # Compiled JavaScript output
│   ├── index.js     # Compiled main CLI
│   └── cli.js       # Compiled entry point
├── package.json     # Dependencies and scripts
├── tsconfig.json    # TypeScript configuration
└── README.md        # This file
```

### Adding New Commands

1. **Add command definition in `src/index.ts`:**
   ```typescript
   program
     .command('newcommand')
     .description('Description of new command')
     .option('-o, --option <value>', 'Option description')
     .action(async (options) => {
       // Command implementation
     });
   ```

2. **Build and test:**
   ```bash
   npm run build
   npm run cli newcommand --option value
   ```

3. **For development with hot reload:**
   ```bash
   npm run dev newcommand --option value
   ```

### Dependencies

- **commander**: CLI framework
- **chalk**: Terminal colorization
- **axios**: HTTP client
- **ora**: Terminal spinners
- **ts-node**: TypeScript execution

## Security Considerations

- The CLI connects to localhost by default for security
- Credential revocation requires explicit `--force` flag
- All API calls are logged for audit purposes
- Sensitive data is not stored locally

## Support

For issues and questions:

1. Check the troubleshooting section above
2. Review the API documentation
3. Check that the web application is running correctly
4. Verify network connectivity to the API endpoints

## License

ISC License - see package.json for details.
