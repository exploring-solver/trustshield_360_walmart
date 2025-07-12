"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// trustshield-cli/index.ts
var commander_1 = require("commander");
var chalk_1 = require("chalk");
var axios_1 = require("axios");
var ora_1 = require("ora");
var program = new commander_1.Command();
var API_BASE = 'http://localhost:3000/api';
// ASCII Art Banner
var banner = "\n\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2557   \u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2557  \u2588\u2588\u2557\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2557     \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \n\u255A\u2550\u2550\u2588\u2588\u2554\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u2550\u2588\u2588\u2554\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2551     \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\n   \u2588\u2588\u2551   \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557   \u2588\u2588\u2551   \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2551     \u2588\u2588\u2551  \u2588\u2588\u2551\n   \u2588\u2588\u2551   \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551   \u2588\u2588\u2551\u255A\u2550\u2550\u2550\u2550\u2588\u2588\u2551   \u2588\u2588\u2551   \u255A\u2550\u2550\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u255D  \u2588\u2588\u2551     \u2588\u2588\u2551  \u2588\u2588\u2551\n   \u2588\u2588\u2551   \u2588\u2588\u2551  \u2588\u2588\u2551\u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551   \u2588\u2588\u2551   \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\n   \u255A\u2550\u255D   \u255A\u2550\u255D  \u255A\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D   \u255A\u2550\u255D   \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u255D  \u255A\u2550\u255D\u255A\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u255D \n                                                                                       \n   ".concat(chalk_1.default.cyan('Walmart TrustShield 360 - Command Line Interface'), "\n   ").concat(chalk_1.default.gray('Quantum-Safe • AI-Powered • Blockchain-Verified'), "\n");
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
    .action(function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var spinner, url, response, trace, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!options.tx) {
                    console.log(chalk_1.default.red('❌ Error: Transaction ID is required'));
                    console.log(chalk_1.default.yellow('Usage: trustshield trace --tx TX12345'));
                    return [2 /*return*/];
                }
                spinner = (0, ora_1.default)('Tracing transaction through security pipeline...').start();
                url = "".concat(API_BASE, "/trace/").concat(options.tx);
                console.log(chalk_1.default.gray("[LOG] GET ".concat(url)));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.get(url)];
            case 2:
                response = _a.sent();
                trace = response.data;
                spinner.succeed('Transaction trace complete');
                console.log(chalk_1.default.blue('\n📋 TRANSACTION TRACE REPORT'));
                console.log(chalk_1.default.gray('━'.repeat(50)));
                console.log(chalk_1.default.white("Transaction ID: ".concat(chalk_1.default.cyan(trace.transactionId))));
                console.log(chalk_1.default.white("Amount: ".concat(chalk_1.default.green('$' + trace.amount))));
                console.log(chalk_1.default.white("Status: ".concat(getStatusColor(trace.status))));
                console.log(chalk_1.default.white("Timestamp: ".concat(chalk_1.default.gray(new Date(trace.timestamp).toLocaleString()))));
                console.log(chalk_1.default.blue('\n🔐 SECURITY PIPELINE STEPS:'));
                trace.steps.forEach(function (step, index) {
                    var statusIcon = step.success ? '✅' : '❌';
                    var duration = step.duration ? chalk_1.default.gray("(".concat(step.duration, "ms)")) : '';
                    console.log("  ".concat(index + 1, ". ").concat(statusIcon, " ").concat(step.name, " ").concat(duration));
                    if (options.verbose && step.details) {
                        console.log(chalk_1.default.gray("     ".concat(step.details)));
                    }
                });
                if (trace.riskScore !== undefined) {
                    console.log(chalk_1.default.blue('\n🎯 RISK ANALYSIS:'));
                    console.log("  Risk Score: ".concat(getRiskColor(trace.riskScore), " (").concat(trace.riskScore, ")"));
                    console.log("  Risk Level: ".concat(getRiskLevelColor(trace.riskLevel)));
                }
                if (trace.blockchainHash) {
                    console.log(chalk_1.default.blue('\n⛓️  BLOCKCHAIN VERIFICATION:'));
                    console.log("  Block Hash: ".concat(chalk_1.default.yellow(trace.blockchainHash)));
                    console.log("  Block Height: ".concat(chalk_1.default.white(trace.blockHeight || 'Pending')));
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                spinner.fail('Failed to trace transaction');
                console.log(chalk_1.default.red("\u274C Error: ".concat(error_1.message)));
                if (error_1 && error_1.response) {
                    console.log(chalk_1.default.red("[LOG] Response: ".concat(JSON.stringify(error_1.response.data))));
                }
                console.log(chalk_1.default.red("[LOG] Stack: ".concat(error_1.stack)));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Risk Analysis Command
program
    .command('risk')
    .description('Analyze risk factors for a transaction')
    .option('-t, --tx <txId>', 'Transaction ID to analyze')
    .option('-u, --user <userId>', 'User ID to analyze')
    .action(function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var spinner, endpoint, url, response, risk, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!options.tx && !options.user) {
                    console.log(chalk_1.default.red('❌ Error: Transaction ID or User ID is required'));
                    return [2 /*return*/];
                }
                spinner = (0, ora_1.default)('Running AI risk analysis...').start();
                endpoint = options.tx ? "risk/transaction/".concat(options.tx) : "risk/user/".concat(options.user);
                url = "".concat(API_BASE, "/").concat(endpoint);
                console.log(chalk_1.default.gray("[LOG] GET ".concat(url)));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.get(url)];
            case 2:
                response = _a.sent();
                risk = response.data;
                spinner.succeed('Risk analysis complete');
                console.log(chalk_1.default.blue('\n🧠 AI FRAUD CORTEX ANALYSIS'));
                console.log(chalk_1.default.gray('━'.repeat(50)));
                console.log("Overall Risk Score: ".concat(getRiskColor(risk.overallScore), " (").concat(risk.overallScore, ")"));
                console.log("Risk Level: ".concat(getRiskLevelColor(risk.riskLevel)));
                console.log("Recommendation: ".concat(getRecommendationColor(risk.recommendation)));
                console.log(chalk_1.default.blue('\n📊 RISK FACTORS:'));
                risk.factors.forEach(function (factor) {
                    var impact = factor.impact > 0.5 ? '🔴 HIGH' : factor.impact > 0.2 ? '🟡 MED' : '🟢 LOW';
                    console.log("  ".concat(impact, " ").concat(factor.name, " (").concat((factor.impact * 100).toFixed(1), "%)"));
                    console.log(chalk_1.default.gray("      ".concat(factor.description)));
                });
                if (risk.tabTransformerScore) {
                    console.log(chalk_1.default.blue('\n🤖 TABULAR DATA ANALYSIS:'));
                    console.log("  TabTransformer Score: ".concat(risk.tabTransformerScore));
                    console.log("  Feature Importance: ".concat(risk.featureImportance.join(', ')));
                }
                if (risk.gnnScore) {
                    console.log(chalk_1.default.blue('\n🕸️  GRAPH NEURAL NETWORK:'));
                    console.log("  GNN Fraud Ring Score: ".concat(risk.gnnScore));
                    console.log("  Connected Entities: ".concat(risk.connectedEntities));
                }
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                spinner.fail('Risk analysis failed');
                console.log(chalk_1.default.red("\u274C Error: ".concat(error_2.message)));
                if (error_2 && error_2.response) {
                    console.log(chalk_1.default.red("[LOG] Response: ".concat(JSON.stringify(error_2.response.data))));
                }
                console.log(chalk_1.default.red("[LOG] Stack: ".concat(error_2.stack)));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Revoke Credential Command
program
    .command('revoke')
    .description('Revoke a verifiable credential')
    .option('--vc <credentialId>', 'Verifiable Credential ID')
    .option('--reason <reason>', 'Reason for revocation')
    .option('--force', 'Force revocation without confirmation')
    .action(function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var spinner, url, payload, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!options.vc) {
                    console.log(chalk_1.default.red('❌ Error: Verifiable Credential ID is required'));
                    return [2 /*return*/];
                }
                if (!options.force) {
                    console.log(chalk_1.default.yellow("\u26A0\uFE0F  You are about to revoke credential: ".concat(options.vc)));
                    console.log(chalk_1.default.yellow('This action cannot be undone. Use --force to confirm.'));
                    return [2 /*return*/];
                }
                spinner = (0, ora_1.default)('Revoking verifiable credential...').start();
                url = "".concat(API_BASE, "/credentials/revoke");
                payload = {
                    credentialId: options.vc,
                    reason: options.reason || 'Admin revocation'
                };
                console.log(chalk_1.default.gray("[LOG] POST ".concat(url)));
                console.log(chalk_1.default.gray("[LOG] Payload: ".concat(JSON.stringify(payload))));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post(url, payload)];
            case 2:
                _a.sent();
                spinner.succeed('Credential revoked successfully');
                console.log(chalk_1.default.red('\n🚫 CREDENTIAL REVOKED'));
                console.log(chalk_1.default.gray('━'.repeat(50)));
                console.log("Credential ID: ".concat(chalk_1.default.cyan(options.vc)));
                console.log("Reason: ".concat(chalk_1.default.white(options.reason || 'Admin revocation')));
                console.log("Revoked At: ".concat(chalk_1.default.gray(new Date().toLocaleString())));
                console.log(chalk_1.default.yellow('\n⚠️  This credential is now invalid and cannot be used for authentication.'));
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                spinner.fail('Failed to revoke credential');
                console.log(chalk_1.default.red("\u274C Error: ".concat(error_3.message)));
                if (error_3 && error_3.response) {
                    console.log(chalk_1.default.red("[LOG] Response: ".concat(JSON.stringify(error_3.response.data))));
                }
                console.log(chalk_1.default.red("[LOG] Stack: ".concat(error_3.stack)));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Wallet Status Command
program
    .command('wallet')
    .description('Check wallet status and freeze/unfreeze')
    .option('-u, --user <userId>', 'User ID to check')
    .option('--freeze', 'Freeze the wallet')
    .option('--unfreeze', 'Unfreeze the wallet')
    .action(function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var spinner, url, payload, url, response, wallet, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!options.user) {
                    console.log(chalk_1.default.red('❌ Error: User ID is required'));
                    return [2 /*return*/];
                }
                spinner = (0, ora_1.default)('Checking wallet status...').start();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                if (!(options.freeze || options.unfreeze)) return [3 /*break*/, 3];
                url = "".concat(API_BASE, "/wallet/").concat(options.freeze ? 'freeze' : 'unfreeze');
                payload = { userId: options.user };
                console.log(chalk_1.default.gray("[LOG] POST ".concat(url)));
                console.log(chalk_1.default.gray("[LOG] Payload: ".concat(JSON.stringify(payload))));
                return [4 /*yield*/, axios_1.default.post(url, payload)];
            case 2:
                _a.sent();
                spinner.succeed("Wallet ".concat(options.freeze ? 'frozen' : 'unfrozen', " successfully"));
                return [3 /*break*/, 5];
            case 3:
                url = "".concat(API_BASE, "/wallet/").concat(options.user);
                console.log(chalk_1.default.gray("[LOG] GET ".concat(url)));
                return [4 /*yield*/, axios_1.default.get(url)];
            case 4:
                response = _a.sent();
                wallet = response.data;
                spinner.succeed('Wallet status retrieved');
                console.log(chalk_1.default.blue('\n💳 WALLET STATUS'));
                console.log(chalk_1.default.gray('━'.repeat(50)));
                console.log("User: ".concat(chalk_1.default.cyan(wallet.userId)));
                console.log("Status: ".concat(wallet.isFrozen ? chalk_1.default.red('🔒 FROZEN') : chalk_1.default.green('🔓 ACTIVE')));
                console.log("Balance: ".concat(chalk_1.default.green('$' + wallet.balance)));
                console.log("Loyalty Points: ".concat(chalk_1.default.yellow(wallet.loyaltyPoints)));
                console.log("Last Activity: ".concat(chalk_1.default.gray(new Date(wallet.lastActivity).toLocaleString())));
                if (wallet.isFrozen) {
                    console.log(chalk_1.default.red("\n\uD83D\uDEA8 Wallet frozen due to: ".concat(wallet.freezeReason)));
                    console.log(chalk_1.default.yellow('Contact support to unfreeze this wallet.'));
                }
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_4 = _a.sent();
                spinner.fail('Wallet operation failed');
                console.log(chalk_1.default.red("\u274C Error: ".concat(error_4.message)));
                if (error_4 && error_4.response) {
                    console.log(chalk_1.default.red("[LOG] Response: ".concat(JSON.stringify(error_4.response.data))));
                }
                console.log(chalk_1.default.red("[LOG] Stack: ".concat(error_4.stack)));
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// Real-time Monitor Command
program
    .command('monitor')
    .description('Monitor real-time security events')
    .option('-f, --filter <type>', 'Filter by event type (fraud, quantum, blockchain)')
    .action(function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var events;
    return __generator(this, function (_a) {
        console.log(chalk_1.default.blue('\n🔍 REAL-TIME SECURITY MONITOR'));
        console.log(chalk_1.default.gray('━'.repeat(50)));
        console.log(chalk_1.default.yellow('Monitoring live security events... (Press Ctrl+C to stop)\n'));
        events = [
            { type: 'quantum', message: 'PQC handshake completed for user-12345', severity: 'info' },
            { type: 'fraud', message: 'High-risk transaction flagged: TX-98765', severity: 'warning' },
            { type: 'blockchain', message: 'Transaction logged to block #45821', severity: 'success' },
            { type: 'fraud', message: 'Fraud ring detected: 3 connected accounts', severity: 'critical' },
        ];
        setInterval(function () {
            var event = events[Math.floor(Math.random() * events.length)];
            if (options.filter && event.type !== options.filter)
                return;
            var timestamp = new Date().toLocaleTimeString();
            var severityColor = {
                info: chalk_1.default.blue,
                success: chalk_1.default.green,
                warning: chalk_1.default.yellow,
                critical: chalk_1.default.red
            }[event.severity] || chalk_1.default.white;
            var typeIcon = {
                quantum: '🔐',
                fraud: '🚨',
                blockchain: '⛓️'
            }[event.type];
            console.log("".concat(chalk_1.default.gray(timestamp), " ").concat(typeIcon, " ").concat(severityColor(event.message)));
        }, 2000);
        return [2 /*return*/];
    });
}); });
// Helper functions
function getStatusColor(status) {
    var colors = {
        'approved': chalk_1.default.green,
        'blocked': chalk_1.default.red,
        'pending': chalk_1.default.yellow,
        'flagged': chalk_1.default.red
    };
    return (colors[status.toLowerCase()] || chalk_1.default.white)(status.toUpperCase());
}
function getRiskColor(score) {
    if (score >= 0.8)
        return chalk_1.default.red(score);
    if (score >= 0.5)
        return chalk_1.default.yellow(score);
    return chalk_1.default.green(score);
}
function getRiskLevelColor(level) {
    var colors = {
        'low': chalk_1.default.green,
        'medium': chalk_1.default.yellow,
        'high': chalk_1.default.red,
        'critical': chalk_1.default.red.bold
    };
    return (colors[level.toLowerCase()] || chalk_1.default.white)(level.toUpperCase());
}
function getRecommendationColor(recommendation) {
    if (recommendation.toLowerCase().includes('block'))
        return chalk_1.default.red(recommendation);
    if (recommendation.toLowerCase().includes('review'))
        return chalk_1.default.yellow(recommendation);
    return chalk_1.default.green(recommendation);
}
program.parse();
