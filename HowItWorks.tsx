import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Eye, Zap, Shield, Settings, Activity, Clock } from 'lucide-react';

const staggerContainer = { 
  hidden: { opacity: 0 }, 
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } } 
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const HowItWorks: React.FC = () => {
  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={staggerContainer}
      className="min-h-screen bg-black py-12 px-4"
    >
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            How PolySync Works
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Sync to top performing agents and automatically copy their winning strategies on Polymarket. 
            Monitor and replicate trading positions with advanced execution parameters and risk management.
          </p>
        </div>

        {/* Overview */}
        <motion.div variants={cardVariant} className="mb-8">
          <Card className="bg-black border-gray-600 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">What is PolySync?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              PolySync is an enterprise-grade platform designed to sync you with top performing agents on Polymarket. 
              It leverages blockchain event monitoring to detect trades in real-time and executes similar positions 
              with configurable parameters through the Polymarket Central Limit Order Book (CLOB) API.
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-white font-semibold">Perfect for traders who want to:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
                <li>Sync with successful agents and copy their winning strategies</li>
                <li>Automate position taking with customizable execution parameters</li>
                <li>Implement sophisticated order execution strategies with fallback mechanisms</li>
              </ul>
            </div>
          </Card>
        </motion.div>

        {/* Market Monitoring */}
        <motion.div variants={cardVariant} className="mb-8">
          <Card className="bg-black border-gray-600 p-8">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-bold text-white">Market Monitoring</h2>
            </div>
            <div className="space-y-4">
              <div className="border-l-2 border-white pl-4">
                <h3 className="text-white font-semibold mb-2">Blockchain Event Tracking</h3>
                <p className="text-gray-300">
                  Monitors the Ethereum blockchain for specific trading events from target wallets
                </p>
              </div>
              <div className="border-l-2 border-white pl-4">
                <h3 className="text-white font-semibold mb-2">Transaction Validation</h3>
                <p className="text-gray-300">
                  Verifies successful transactions before attempting to copy positions
                </p>
              </div>
              <div className="border-l-2 border-white pl-4">
                <h3 className="text-white font-semibold mb-2">Real-time Data Processing</h3>
                <p className="text-gray-300">
                  Processes block data to extract relevant trade information including token IDs, sides, and amounts
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Trade Execution */}
        <motion.div variants={cardVariant} className="mb-8">
          <Card className="bg-black border-gray-600 p-8">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-bold text-white">Trade Execution</h2>
            </div>
            <div className="space-y-6">
              <div className="border-l-2 border-white pl-4">
                <h3 className="text-white font-semibold mb-2">Parameterized Position Sizing</h3>
                <p className="text-gray-300">
                  Configurable ratio-based position sizing relative to the target wallet
                </p>
              </div>
              <div className="border-l-2 border-white pl-4">
                <h3 className="text-white font-semibold mb-2">Multi-stage Execution Strategy</h3>
                <p className="text-gray-300 mb-3">
                  Implements a three-tiered approach to order placement with progressive price adjustments
                </p>
                <div className="space-y-3 ml-4">
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">PRIMARY PHASE</span>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-400">
                      Places an initial order mirroring the target's price point. Waits for a configurable 
                      timeout period for the order to fill. Proceeds to secondary phase if the order remains unfilled.
                    </p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">SECONDARY ADJUSTMENT PHASE</span>
                      <Activity className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-400">
                      Adjusts price by a configurable increment to improve fill probability. Slightly reduces 
                      position size to manage risk. Implements a separate timeout period for this phase.
                    </p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">FINAL EXECUTION PHASE</span>
                      <Zap className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-400">
                      Makes a final price adjustment to maximize fill probability. Further reduces position size. 
                      Represents the last attempt to execute the trade.
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-l-2 border-white pl-4">
                <h3 className="text-white font-semibold mb-2">Intelligent Retry Logic</h3>
                <p className="text-gray-300">
                  Automatically retries failed orders with optimized parameters
                </p>
              </div>
              <div className="border-l-2 border-white pl-4">
                <h3 className="text-white font-semibold mb-2">Order Lifecycle Management</h3>
                <p className="text-gray-300">
                  Monitors order status and cancels partially filled orders when necessary
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Risk Management */}
        <motion.div variants={cardVariant} className="mb-8">
          <Card className="bg-black border-gray-600 p-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-bold text-white">Risk Management</h2>
            </div>
            <div className="space-y-4">
              <div className="border-l-2 border-white pl-4">
                <h3 className="text-white font-semibold mb-2">Minimum Size Enforcement</h3>
                <p className="text-gray-300">
                  Ensures orders meet minimum size requirements
                </p>
              </div>
              <div className="border-l-2 border-white pl-4">
                <h3 className="text-white font-semibold mb-2">Value Thresholds</h3>
                <p className="text-gray-300">
                  Skips execution for trades below configurable value thresholds
                </p>
              </div>
              <div className="border-l-2 border-white pl-4">
                <h3 className="text-white font-semibold mb-2">Balance Verification</h3>
                <p className="text-gray-300">
                  Checks USDC balance before attempting trades
                </p>
              </div>
              <div className="border-l-2 border-white pl-4">
                <h3 className="text-white font-semibold mb-2">Position Sizing</h3>
                <p className="text-gray-300">
                  Implements proportional position sizing relative to target trades
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Configuration & Customization */}
        <motion.div variants={cardVariant} className="mb-8">
          <Card className="bg-black border-gray-600 p-8">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-bold text-white">Configuration & Customization</h2>
            </div>
            <div className="space-y-4 mb-6">
              <div className="border-l-2 border-white pl-4">
                <h3 className="text-white font-semibold mb-2">Interactive Setup</h3>
                <p className="text-gray-300">
                  User-friendly interface for configuring trading parameters
                </p>
              </div>
              <div className="border-l-2 border-white pl-4">
                <h3 className="text-white font-semibold mb-2">Flexible Execution Parameters</h3>
                <p className="text-gray-300">
                  Customizable timeouts, price adjustments, and retry limits
                </p>
              </div>
              <div className="border-l-2 border-white pl-4">
                <h3 className="text-white font-semibold mb-2">Balance Verification</h3>
                <p className="text-gray-300">
                  Integrates with USDC contract to verify sufficient funds before execution
                </p>
              </div>
            </div>

            <Separator className="bg-gray-600 my-6" />

            {/* Trading Parameters */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Trading Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-white font-semibold mb-1">Target Wallet</h4>
                  <p className="text-sm text-gray-400 mb-2">Wallet address to monitor</p>
                  <p className="text-xs text-gray-500">Recommendation: Use addresses with proven trading history</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-white font-semibold mb-1">Copy Ratio</h4>
                  <p className="text-sm text-gray-400 mb-2">Position size ratio (0-1)</p>
                  <p className="text-xs text-gray-500">Recommendation: Start with 0.1-0.3 for risk management</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-white font-semibold mb-1">Retry Limit</h4>
                  <p className="text-sm text-gray-400 mb-2">Maximum retry attempts</p>
                  <p className="text-xs text-gray-500">Recommendation: 3-5 is typically sufficient</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-white font-semibold mb-1">Initial Order Timeout</h4>
                  <p className="text-sm text-gray-400 mb-2">First attempt timeout (seconds)</p>
                  <p className="text-xs text-gray-500">Recommendation: 30-60 seconds recommended</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-white font-semibold mb-1">Second Order Increment</h4>
                  <p className="text-sm text-gray-400 mb-2">Price adjustment (cents)</p>
                  <p className="text-xs text-gray-500">Recommendation: 1-3 cents depending on volatility</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-white font-semibold mb-1">Final Order Increment</h4>
                  <p className="text-sm text-gray-400 mb-2">Final price adjustment (cents)</p>
                  <p className="text-xs text-gray-500">Recommendation: 2-5 cents for maximum fill probability</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Technical Architecture */}
        <motion.div variants={cardVariant}>
          <Card className="bg-black border-gray-600 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Technical Architecture</h2>
            <p className="text-gray-300 mb-6">
              The application is built on a modular architecture with the following components:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">Trade Monitor</h4>
                <p className="text-sm text-gray-400">
                  Listens for blockchain events and detects relevant trades
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">Trade Executor</h4>
                <p className="text-sm text-gray-400">
                  Handles order creation, submission, and management
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">CLOB Client</h4>
                <p className="text-sm text-gray-400">
                  Interfaces with the Polymarket API for order execution
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">Database Integration</h4>
                <p className="text-sm text-gray-400">
                  Stores trade data for analysis and record-keeping
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">Configuration Management</h4>
                <p className="text-sm text-gray-400">
                  Securely manages API credentials and trading parameters
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HowItWorks;
