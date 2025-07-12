// trustshield-cli/index.ts
import { Command } from 'commander';
import chalk from 'chalk';
import axios from 'axios';
import ora from 'ora';

const program = new Command();
const API_BASE = 'http://localhost:3000/api';

// ASCII Art Banner
const banner = `
████████╗██████╗ ██╗   ██╗███████╗████████╗███████╗██╗  ██╗██╗███████╗██╗     ██████╗ 
╚══██╔══╝██╔══██╗██║   ██║██╔════╝╚══██╔══╝██╔════╝██║  ██║██║██╔════╝██║     ██╔══██╗
   ██║   ██████╔╝██║   ██║███████╗   ██║   ███████╗███████║██║█████╗  ██║     ██║  ██║
   ██║   ██╔══██╗██║   ██║╚════██║   ██║   ╚════██║██╔══██║██║██╔══╝  ██║     ██║  ██║
   ██║   ██║  ██║╚██████╔╝███████║   ██║   ███████║██║  ██║██║███████╗███████╗██████╔╝
   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═════╝ 
                                                                                       
   ${chalk.cyan('Walmart TrustShield 360 - Command Line Interface')}
   ${chalk.gray('Quantum-Safe • AI-Powered • Blockchain-Verified')}
`;

console.log(banner);

program
  .name('trustshield')
  .description('CLI for Walmart TrustShield 360 Security Platform')
  .version('1.0.0');

// Trace Transaction Command
program
  .command('trace')
  .description('Trace a transaction through the security pipeline')
  .option('-t, --tx <txId>', 'Transaction ID to trace')
  .option('-v, --verbose', 'Show detailed trace information')
  .action(async (options) => {
    if (!options.tx) {
      console.log(chalk.red('❌ Error: Transaction ID is required'));
      console.log(chalk.yellow('Usage: trustshield trace --tx TX12345'));
      return;
    }

    const spinner = ora('Tracing transaction through security pipeline...').start();

    const url = `${API_BASE}/trace/${options.tx}`;
    console.log(chalk.gray(`[LOG] GET ${url}`));
    try {
      const response = await axios.get(url);
      const trace = response.data;
      
      spinner.succeed('Transaction trace complete');
      
      console.log(chalk.blue('\n📋 TRANSACTION TRACE REPORT'));
      console.log(chalk.gray('━'.repeat(50)));
      
      console.log(chalk.white(`Transaction ID: ${chalk.cyan(trace.transactionId)}`));
      console.log(chalk.white(`Amount: ${chalk.green('$' + trace.amount)}`));
      console.log(chalk.white(`Status: ${getStatusColor(trace.status)}`));
      console.log(chalk.white(`Timestamp: ${chalk.gray(new Date(trace.timestamp).toLocaleString())}`));
      
      console.log(chalk.blue('\n🔐 SECURITY PIPELINE STEPS:'));
      trace.steps.forEach((step: any, index: number) => {
        const statusIcon = step.success ? '✅' : '❌';
        const duration = step.duration ? chalk.gray(`(${step.duration}ms)`) : '';
        console.log(`  ${index + 1}. ${statusIcon} ${step.name} ${duration}`);
        
        if (options.verbose && step.details) {
          console.log(chalk.gray(`     ${step.details}`));
        }
      });
      
      if (trace.riskScore !== undefined) {
        console.log(chalk.blue('\n🎯 RISK ANALYSIS:'));
        console.log(`  Risk Score: ${getRiskColor(trace.riskScore)} (${trace.riskScore})`);
        console.log(`  Risk Level: ${getRiskLevelColor(trace.riskLevel)}`);
      }
      
      if (trace.blockchainHash) {
        console.log(chalk.blue('\n⛓️  BLOCKCHAIN VERIFICATION:'));
        console.log(`  Block Hash: ${chalk.yellow(trace.blockchainHash)}`);
        console.log(`  Block Height: ${chalk.white(trace.blockHeight || 'Pending')}`);
      }
      
    } catch (error) {
      spinner.fail('Failed to trace transaction');
      console.log(chalk.red(`❌ Error: ${(error as any).message}`));
      if (error && (error as any).response) {
        console.log(chalk.red(`[LOG] Response: ${JSON.stringify((error as any).response.data)}`));
      }
      console.log(chalk.red(`[LOG] Stack: ${(error as any).stack}`));
    }
  });

// Risk Analysis Command
program
  .command('risk')
  .description('Analyze risk factors for a transaction')
  .option('-t, --tx <txId>', 'Transaction ID to analyze')
  .option('-u, --user <userId>', 'User ID to analyze')
  .action(async (options) => {
    if (!options.tx && !options.user) {
      console.log(chalk.red('❌ Error: Transaction ID or User ID is required'));
      return;
    }

    const spinner = ora('Running AI risk analysis...').start();

    const endpoint = options.tx ? `risk/transaction/${options.tx}` : `risk/user/${options.user}`;
    const url = `${API_BASE}/${endpoint}`;
    console.log(chalk.gray(`[LOG] GET ${url}`));
    try {
      const response = await axios.get(url);
      const risk = response.data;
      
      spinner.succeed('Risk analysis complete');
      
      console.log(chalk.blue('\n🧠 AI FRAUD CORTEX ANALYSIS'));
      console.log(chalk.gray('━'.repeat(50)));
      
      console.log(`Overall Risk Score: ${getRiskColor(risk.overallScore)} (${risk.overallScore})`);
      console.log(`Risk Level: ${getRiskLevelColor(risk.riskLevel)}`);
      console.log(`Recommendation: ${getRecommendationColor(risk.recommendation)}`);
      
      console.log(chalk.blue('\n📊 RISK FACTORS:'));
      risk.factors.forEach((factor: any) => {
        const impact = factor.impact > 0.5 ? '🔴 HIGH' : factor.impact > 0.2 ? '🟡 MED' : '🟢 LOW';
        console.log(`  ${impact} ${factor.name} (${(factor.impact * 100).toFixed(1)}%)`);
        console.log(chalk.gray(`      ${factor.description}`));
      });
      
      if (risk.tabTransformerScore) {
        console.log(chalk.blue('\n🤖 TABULAR DATA ANALYSIS:'));
        console.log(`  TabTransformer Score: ${risk.tabTransformerScore}`);
        console.log(`  Feature Importance: ${risk.featureImportance.join(', ')}`);
      }
      
      if (risk.gnnScore) {
        console.log(chalk.blue('\n🕸️  GRAPH NEURAL NETWORK:'));
        console.log(`  GNN Fraud Ring Score: ${risk.gnnScore}`);
        console.log(`  Connected Entities: ${risk.connectedEntities}`);
      }
      
    } catch (error) {
      spinner.fail('Risk analysis failed');
      console.log(chalk.red(`❌ Error: ${(error as any).message}`));
      if (error && (error as any).response) {
        console.log(chalk.red(`[LOG] Response: ${JSON.stringify((error as any).response.data)}`));
      }
      console.log(chalk.red(`[LOG] Stack: ${(error as any).stack}`));
    }
  });

// Revoke Credential Command
program
  .command('revoke')
  .description('Revoke a verifiable credential')
  .option('--vc <credentialId>', 'Verifiable Credential ID')
  .option('--reason <reason>', 'Reason for revocation')
  .option('--force', 'Force revocation without confirmation')
  .action(async (options) => {
    if (!options.vc) {
      console.log(chalk.red('❌ Error: Verifiable Credential ID is required'));
      return;
    }

    if (!options.force) {
      console.log(chalk.yellow(`⚠️  You are about to revoke credential: ${options.vc}`));
      console.log(chalk.yellow('This action cannot be undone. Use --force to confirm.'));
      return;
    }

    const spinner = ora('Revoking verifiable credential...').start();

    const url = `${API_BASE}/credentials/revoke`;
    const payload = {
      credentialId: options.vc,
      reason: options.reason || 'Admin revocation'
    };
    console.log(chalk.gray(`[LOG] POST ${url}`));
    console.log(chalk.gray(`[LOG] Payload: ${JSON.stringify(payload)}`));
    try {
      await axios.post(url, payload);
      
      spinner.succeed('Credential revoked successfully');
      
      console.log(chalk.red('\n🚫 CREDENTIAL REVOKED'));
      console.log(chalk.gray('━'.repeat(50)));
      console.log(`Credential ID: ${chalk.cyan(options.vc)}`);
      console.log(`Reason: ${chalk.white(options.reason || 'Admin revocation')}`);
      console.log(`Revoked At: ${chalk.gray(new Date().toLocaleString())}`);
      console.log(chalk.yellow('\n⚠️  This credential is now invalid and cannot be used for authentication.'));
      
    } catch (error) {
      spinner.fail('Failed to revoke credential');
      console.log(chalk.red(`❌ Error: ${(error as any).message}`));
      if (error && (error as any).response) {
        console.log(chalk.red(`[LOG] Response: ${JSON.stringify((error as any).response.data)}`));
      }
      console.log(chalk.red(`[LOG] Stack: ${(error as any).stack}`));
    }
  });

// Wallet Status Command
program
  .command('wallet')
  .description('Check wallet status and freeze/unfreeze')
  .option('-u, --user <userId>', 'User ID to check')
  .option('--freeze', 'Freeze the wallet')
  .option('--unfreeze', 'Unfreeze the wallet')
  .action(async (options) => {
    if (!options.user) {
      console.log(chalk.red('❌ Error: User ID is required'));
      return;
    }

    const spinner = ora('Checking wallet status...').start();
    
    try {
      if (options.freeze || options.unfreeze) {
        const url = `${API_BASE}/wallet/${options.freeze ? 'freeze' : 'unfreeze'}`;
        const payload = { userId: options.user };
        console.log(chalk.gray(`[LOG] POST ${url}`));
        console.log(chalk.gray(`[LOG] Payload: ${JSON.stringify(payload)}`));
        await axios.post(url, payload);
        spinner.succeed(`Wallet ${options.freeze ? 'frozen' : 'unfrozen'} successfully`);
      } else {
        const url = `${API_BASE}/wallet/${options.user}`;
        console.log(chalk.gray(`[LOG] GET ${url}`));
        const response = await axios.get(url);
        const wallet = response.data;
        
        spinner.succeed('Wallet status retrieved');
        
        console.log(chalk.blue('\n💳 WALLET STATUS'));
        console.log(chalk.gray('━'.repeat(50)));
        console.log(`User: ${chalk.cyan(wallet.userId)}`);
        console.log(`Status: ${wallet.isFrozen ? chalk.red('🔒 FROZEN') : chalk.green('🔓 ACTIVE')}`);
        console.log(`Balance: ${chalk.green('$' + wallet.balance)}`);
        console.log(`Loyalty Points: ${chalk.yellow(wallet.loyaltyPoints)}`);
        console.log(`Last Activity: ${chalk.gray(new Date(wallet.lastActivity).toLocaleString())}`);
        
        if (wallet.isFrozen) {
          console.log(chalk.red(`\n🚨 Wallet frozen due to: ${wallet.freezeReason}`));
          console.log(chalk.yellow('Contact support to unfreeze this wallet.'));
        }
      }
      
    } catch (error) {
      spinner.fail('Wallet operation failed');
      console.log(chalk.red(`❌ Error: ${(error as any).message}`));
      if (error && (error as any).response) {
        console.log(chalk.red(`[LOG] Response: ${JSON.stringify((error as any).response.data)}`));
      }
      console.log(chalk.red(`[LOG] Stack: ${(error as any).stack}`));
    }
  });

// Real-time Monitor Command
program
  .command('monitor')
  .description('Monitor real-time security events')
  .option('-f, --filter <type>', 'Filter by event type (fraud, quantum, blockchain)')
  .action(async (options) => {
    console.log(chalk.blue('\n🔍 REAL-TIME SECURITY MONITOR'));
    console.log(chalk.gray('━'.repeat(50)));
    console.log(chalk.yellow('Monitoring live security events... (Press Ctrl+C to stop)\n'));
    
    // Simulate real-time events
    const events = [
      { type: 'quantum', message: 'PQC handshake completed for user-12345', severity: 'info' },
      { type: 'fraud', message: 'High-risk transaction flagged: TX-98765', severity: 'warning' },
      { type: 'blockchain', message: 'Transaction logged to block #45821', severity: 'success' },
      { type: 'fraud', message: 'Fraud ring detected: 3 connected accounts', severity: 'critical' },
    ];
    
    setInterval(() => {
      const event = events[Math.floor(Math.random() * events.length)];
      
      if (options.filter && event.type !== options.filter) return;
      
      const timestamp = new Date().toLocaleTimeString();
      const severityColor = {
        info: chalk.blue,
        success: chalk.green,
        warning: chalk.yellow,
        critical: chalk.red
      }[event.severity] || chalk.white;
      
      const typeIcon = {
        quantum: '🔐',
        fraud: '🚨',
        blockchain: '⛓️'
      }[event.type];
      
      console.log(`${chalk.gray(timestamp)} ${typeIcon} ${severityColor(event.message)}`);
    }, 2000);
  });

// Helper functions
function getStatusColor(status: string): string {
  const colors: { [key: string]: Function } = {
    'approved': chalk.green,
    'blocked': chalk.red,
    'pending': chalk.yellow,
    'flagged': chalk.red
  };
  return (colors[status.toLowerCase()] || chalk.white)(status.toUpperCase());
}

function getRiskColor(score: number): string {
  if (score >= 0.8) return chalk.red(score);
  if (score >= 0.5) return chalk.yellow(score);
  return chalk.green(score);
}

function getRiskLevelColor(level: string): string {
  const colors: { [key: string]: Function } = {
    'low': chalk.green,
    'medium': chalk.yellow,
    'high': chalk.red,
    'critical': chalk.red.bold
  };
  return (colors[level.toLowerCase()] || chalk.white)(level.toUpperCase());
}

function getRecommendationColor(recommendation: string): string {
  if (recommendation.toLowerCase().includes('block')) return chalk.red(recommendation);
  if (recommendation.toLowerCase().includes('review')) return chalk.yellow(recommendation);
  return chalk.green(recommendation);
}

program.parse();