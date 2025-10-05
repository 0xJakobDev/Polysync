import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Activity, DollarSign, Target, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const staggerContainer = { 
  hidden: { opacity: 0 }, 
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } } 
};

const rowVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

interface LeaderboardAgent {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  totalTrades: number;
  successRate: number;
  roi: number;
  totalVolume: number;
  winLossRatio: string;
  activePositions: number;
}

type SortField = 'totalTrades' | 'successRate' | 'roi' | 'totalVolume';

// -- USING MOCK DATA --
const mockLeaderboardData: LeaderboardAgent[] = [
  {
    rank: 1,
    id: '5',
    name: 'Crypto Degen',
    avatar: '🚀',
    totalTrades: 445,
    successRate: 72,
    roi: 184.5,
    totalVolume: 156780,
    winLossRatio: '3.2:1',
    activePositions: 8
  },
  {
    rank: 2,
    id: '2',
    name: 'Momentum Trader',
    avatar: '📈',
    totalTrades: 312,
    successRate: 78,
    roi: 156.2,
    totalVolume: 98450,
    winLossRatio: '3.5:1',
    activePositions: 5
  },
  {
    rank: 3,
    id: '1',
    name: 'Whale Watcher Pro',
    avatar: '🐋',
    totalTrades: 156,
    successRate: 87,
    roi: 142.8,
    totalVolume: 45230,
    winLossRatio: '6.7:1',
    activePositions: 4
  },
  {
    rank: 4,
    id: '4',
    name: 'Political Prophet',
    avatar: '🎯',
    totalTrades: 124,
    successRate: 91,
    roi: 138.6,
    totalVolume: 34560,
    winLossRatio: '10.1:1',
    activePositions: 3
  },
  {
    rank: 5,
    id: '3',
    name: 'Safe Harbor',
    avatar: '⚓',
    totalTrades: 89,
    successRate: 94,
    roi: 89.4,
    totalVolume: 23670,
    winLossRatio: '15.7:1',
    activePositions: 3
  },
  {
    rank: 6,
    id: '6',
    name: 'Macro Maven',
    avatar: '🌍',
    totalTrades: 67,
    successRate: 89,
    roi: 76.2,
    totalVolume: 18920,
    winLossRatio: '8.1:1',
    activePositions: 2
  }
];

export const Leaderboard: React.FC = () => {
  const [sortField, setSortField] = useState<SortField>('roi');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...mockLeaderboardData].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    return (a[sortField] - b[sortField]) * multiplier;
  });

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-white text-black';
    if (rank === 2) return 'bg-gray-400 text-black';
    if (rank === 3) return 'bg-gray-500 text-white';
    return 'bg-gray-700 text-white';
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={staggerContainer}
      className="min-h-screen bg-black py-12 px-4"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Top PolySync Agents
          </h1>
          <p className="text-gray-400 text-lg">
            Top performing agents ranked by key performance metrics
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-black border-gray-600 p-6">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-white" />
              <div>
                <p className="text-sm text-gray-400">Total Agents</p>
                <p className="text-2xl font-bold text-white">{mockLeaderboardData.length}</p>
              </div>
            </div>
          </Card>
          <Card className="bg-black border-gray-600 p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-white" />
              <div>
                <p className="text-sm text-gray-400">Total Trades</p>
                <p className="text-2xl font-bold text-white">
                  {mockLeaderboardData.reduce((sum, agent) => sum + agent.totalTrades, 0)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="bg-black border-gray-600 p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-white" />
              <div>
                <p className="text-sm text-gray-400">Total Volume</p>
                <p className="text-2xl font-bold text-white">
                  ${(mockLeaderboardData.reduce((sum, agent) => sum + agent.totalVolume, 0) / 1000).toFixed(0)}k
                </p>
              </div>
            </div>
          </Card>
          <Card className="bg-black border-gray-600 p-6">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-white" />
              <div>
                <p className="text-sm text-gray-400">Avg Success Rate</p>
                <p className="text-2xl font-bold text-white">
                  {(mockLeaderboardData.reduce((sum, agent) => sum + agent.successRate, 0) / mockLeaderboardData.length).toFixed(0)}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Leaderboard Table */}
        <Card className="bg-black border-gray-600 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-900 border-b border-gray-700 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 items-center text-sm font-semibold text-gray-400">
              <div className="col-span-1">Rank</div>
              <div className="col-span-3">Agent</div>
              <div className="col-span-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('totalTrades')}
                  className="text-gray-400 hover:text-white p-0 h-auto"
                >
                  Trades <ArrowUpDown className="w-3 h-3 ml-1" />
                </Button>
              </div>
              <div className="col-span-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('successRate')}
                  className="text-gray-400 hover:text-white p-0 h-auto"
                >
                  Success Rate <ArrowUpDown className="w-3 h-3 ml-1" />
                </Button>
              </div>
              <div className="col-span-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('roi')}
                  className="text-gray-400 hover:text-white p-0 h-auto"
                >
                  ROI <ArrowUpDown className="w-3 h-3 ml-1" />
                </Button>
              </div>
              <div className="col-span-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('totalVolume')}
                  className="text-gray-400 hover:text-white p-0 h-auto"
                >
                  Volume <ArrowUpDown className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-700">
            {sortedData.map((agent, index) => (
              <motion.div
                key={agent.id}
                variants={rowVariant}
                className="px-6 py-5 hover:bg-gray-900 transition-colors cursor-pointer"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Rank */}
                  <div className="col-span-1">
                    <Badge className={`${getRankBadgeColor(agent.rank)} font-bold`}>
                      #{agent.rank}
                    </Badge>
                  </div>

                  {/* Agent Info */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{agent.avatar}</div>
                      <div>
                        <p className="text-white font-semibold">{agent.name}</p>
                        <p className="text-xs text-gray-400">{agent.activePositions} active positions</p>
                      </div>
                    </div>
                  </div>

                  {/* Total Trades */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span className="text-white font-medium">{agent.totalTrades}</span>
                    </div>
                  </div>

                  {/* Success Rate */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-white" />
                      <span className="text-white font-medium">{agent.successRate}%</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">W/L: {agent.winLossRatio}</p>
                  </div>

                  {/* ROI */}
                  <div className="col-span-2">
                    <div className="text-white font-medium">+{agent.roi}%</div>
                  </div>

                  {/* Volume */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-white font-medium">
                        ${(agent.totalVolume / 1000).toFixed(1)}k
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Legend */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Rankings are based on a combination of success rate, total volume, and ROI. 
            Data is updated in real-time as agents execute trades.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Leaderboard;
