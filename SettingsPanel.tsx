import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RecoveryKeyManagement } from '@/components/RecoveryKeyManagement';
import { useAuth } from '@tarobase/js-sdk';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  agentName: string;
  walletAddress: string;
  protectionLevel: string;
}

interface TokenPosition {
  address: string;
  allocation: number;
  riskLevel: 'low' | 'medium' | 'high';
}

type TimePeriod = '24h' | '7d' | '1M' | '3M' | '1Y' | 'All';

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  agentId,
  agentName,
  walletAddress,
  protectionLevel
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('7d');
  const { user } = useAuth();

  // Mock performance data - would come from API in real implementation
  const performanceData = {
    '24h': [10, 15, 12, 18, 20, 17, 22],
    '7d': [10, 15, 12, 18, 25, 20, 28, 35, 32, 38, 42],
    '1M': [10, 15, 20, 18, 22, 28, 25, 30, 35, 38, 42, 45, 50, 48],
    '3M': [10, 20, 15, 25, 30, 28, 35, 40, 38, 45, 50, 48, 55],
    '1Y': [10, 25, 30, 35, 40, 45, 50, 55, 60],
    'All': [5, 10, 20, 30, 40, 50, 55, 60]
  };

  // Mock token positions - would come from API in real implementation
  const tokenPositions: TokenPosition[] = [
    { address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', allocation: 35, riskLevel: 'low' },
    { address: 'So11111111111111111111111111111111111111112', allocation: 28, riskLevel: 'medium' },
    { address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', allocation: 22, riskLevel: 'low' },
    { address: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So', allocation: 15, riskLevel: 'high' }
  ];

  const periods: TimePeriod[] = ['24h', '7d', '1M', '3M', '1Y', 'All'];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-white';
      case 'medium': return 'bg-gray-400';
      case 'high': return 'bg-gray-600';
      default: return 'bg-gray-500';
    }
  };

  const getRiskTextColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-white';
      case 'medium': return 'text-gray-300';
      case 'high': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getProtectionLevelColor = (level: string) => {
    return 'bg-white/10 text-white border-gray-600';
  };

  // Calculate SVG path for the performance graph
  const generatePath = () => {
    const data = performanceData[selectedPeriod];
    const width = 800;
    const height = 200;
    const padding = 20;
    
    const xStep = (width - padding * 2) / (data.length - 1);
    const yMin = Math.min(...data);
    const yMax = Math.max(...data);
    const yRange = yMax - yMin;
    
    let path = '';
    data.forEach((value, index) => {
      const x = padding + index * xStep;
      const y = height - padding - ((value - yMin) / yRange) * (height - padding * 2);
      
      if (index === 0) {
        path += `M ${x},${y}`;
      } else {
        path += ` L ${x},${y}`;
      }
    });
    
    return path;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-4xl bg-black border-l border-gray-600 z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{agentName}</h2>
                  <p className="text-sm text-gray-400 font-mono mt-1">{walletAddress}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <Separator className="bg-gray-600" />

              {/* Performance Graph */}
              <Card className="bg-black border-gray-600 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Performance</h3>
                  <div className="flex gap-2">
                    {periods.map((period) => (
                      <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                          selectedPeriod === period
                            ? 'bg-white text-black'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Graph */}
                <div className="bg-black rounded-lg p-4" style={{ height: '240px' }}>
                  <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line
                        key={i}
                        x1="20"
                        y1={20 + i * 40}
                        x2="780"
                        y2={20 + i * 40}
                        stroke="#374151"
                        strokeWidth="0.5"
                        opacity="0.3"
                      />
                    ))}
                    
                    {/* Performance line */}
                    <path
                      d={generatePath()}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Return</p>
                    <p className="text-xl font-bold text-white">+{performanceData[selectedPeriod][performanceData[selectedPeriod].length - 1]}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Best Day</p>
                    <p className="text-xl font-bold text-white">+{Math.max(...performanceData[selectedPeriod].map((v, i, arr) => i > 0 ? v - arr[i-1] : 0)).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Avg Daily</p>
                    <p className="text-xl font-bold text-white">+{(performanceData[selectedPeriod][performanceData[selectedPeriod].length - 1] / performanceData[selectedPeriod].length).toFixed(2)}%</p>
                  </div>
                </div>
              </Card>

              {/* Wallet Safety & Protection Level */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="bg-black border-gray-600 p-6">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-white" />
                    Wallet Safety
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Risk Score</span>
                        <span className="text-lg font-bold text-white">8.7/10</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div className="bg-white h-2 rounded-full" style={{ width: '87%' }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-gray-500 mb-1">Diversification</p>
                        <p className="text-white font-semibold">High</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Volatility</p>
                        <p className="text-white font-semibold">Medium</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-black border-gray-600 p-6">
                  <h3 className="text-sm font-semibold text-white mb-4">Trading Protection</h3>
                  <div className="space-y-3">
                    <div className={`px-4 py-3 rounded-lg border ${getProtectionLevelColor(protectionLevel)}`}>
                      <p className="text-xs uppercase tracking-wider mb-1">Current Level</p>
                      <p className="text-lg font-bold">{protectionLevel}</p>
                    </div>
                    <div className="flex gap-2">
                      {['Degen', 'Moderate', 'Guarded'].map((level) => (
                        <button
                          key={level}
                          className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                            level === protectionLevel
                              ? 'bg-white text-black'
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Token Allocations */}
              <Card className="bg-black border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Token Allocations</h3>
                <div className="space-y-3">
                  {tokenPositions.map((token, idx) => (
                    <div key={idx} className="bg-black rounded-lg p-4 border border-gray-600">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Token Address</p>
                          <p className="text-sm text-white font-mono truncate">{token.address}</p>
                        </div>
                        <div className="ml-4">
                          <div className={`px-2 py-1 rounded text-xs font-semibold ${getRiskColor(token.riskLevel)} bg-opacity-20 ${getRiskTextColor(token.riskLevel)}`}>
                            {token.riskLevel.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Allocation</span>
                          <span className="text-white font-semibold">{token.allocation}%</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getRiskColor(token.riskLevel)}`}
                            style={{ width: `${token.allocation}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Allocation Summary */}
                <div className="mt-6 pt-6 border-t border-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Total Allocated</span>
                    <span className="text-lg font-bold text-white">
                      {tokenPositions.reduce((sum, token) => sum + token.allocation, 0)}%
                    </span>
                  </div>
                </div>
              </Card>

              {/* Recovery Key Management */}
              <RecoveryKeyManagement userId={user?.address} />

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-white hover:bg-gray-200 text-black"
                  size="lg"
                >
                  Save Changes
                </Button>
                <Button
                  className="flex-1 bg-white hover:bg-gray-200 text-black"
                  size="lg"
                >
                  Export Data
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;
