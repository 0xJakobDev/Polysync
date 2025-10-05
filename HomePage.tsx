import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Settings, Activity, TrendingUp, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Loader2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@tarobase/js-sdk';
import { setAgents, getManyAgents, Address, Time } from '@/lib/tarobase';
import { toast } from 'sonner';
import { useTarobaseData } from '@/hooks/use-tarobase-data';
import { subscribeManyAgents, type AgentsResponse } from '@/lib/tarobase';
import { SettingsPanel } from '@/components/SettingsPanel';
import { BuyModal } from '@/components/BuyModal';
import { WithdrawalModal } from '@/components/WithdrawalModal';

// Animation variants
const staggerContainer = { 
  hidden: { opacity: 0 }, 
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } } 
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

type ProtectionLevel = 'Degen' | 'Moderate' | 'Guarded';

interface Position {
  name: string;
  percentage: number;
  color: string;
}

interface TradingConfig {
  targetWallet: string;
  copyRatio: number;
  retryLimit: number;
  initialOrderTimeout: number;
  secondOrderIncrement: number;
  secondOrderTimeout: number;
  finalOrderIncrement: number;
  finalOrderTimeout: number;
  minPositionSize: number;
}

interface ExecutionPhase {
  phase: 'primary' | 'secondary' | 'final';
  status: 'pending' | 'active' | 'completed' | 'failed';
  attempts: number;
  price?: number;
  size?: number;
}

interface Trade {
  id: string;
  timestamp: number;
  market: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  executionPhase?: ExecutionPhase;
}

interface TraderAgent {
  id: string;
  name: string;
  avatar: string;
  description: string;
  protectionLevel: ProtectionLevel;
  positions: Position[];
  config: TradingConfig;
  usdcBalance: number;
  isConnected: boolean;
  recentTrades: Trade[];
  stats: {
    totalTrades: number;
    successRate: number;
    totalVolume: number;
  };
}

// -- USING MOCK DATA --
const mockTraderAgents: TraderAgent[] = [
  {
    id: '1',
    name: 'Whale Watcher Pro',
    avatar: '🐋',
    description: 'Follows top whale wallets with proven track record in prediction markets',
    protectionLevel: 'Moderate',
    positions: [
      { name: 'Trump Wins 2024', percentage: 65, color: 'bg-blue-500' },
      { name: 'ETH > $3000', percentage: 48, color: 'bg-purple-500' },
      { name: 'Fed Rate Cut', percentage: 72, color: 'bg-green-500' }
    ],
    config: {
      targetWallet: '0x742d...35A4',
      copyRatio: 0.25,
      retryLimit: 3,
      initialOrderTimeout: 45,
      secondOrderIncrement: 2,
      secondOrderTimeout: 30,
      finalOrderIncrement: 4,
      finalOrderTimeout: 20,
      minPositionSize: 10
    },
    usdcBalance: 5420.50,
    isConnected: true,
    recentTrades: [
      { id: 't1', timestamp: Date.now() - 300000, market: 'Trump Wins 2024', side: 'buy', amount: 125, price: 0.65, status: 'completed' },
      { id: 't2', timestamp: Date.now() - 180000, market: 'Fed Rate Cut', side: 'buy', amount: 200, price: 0.72, status: 'executing', executionPhase: { phase: 'secondary', status: 'active', attempts: 1, price: 0.73, size: 195 } }
    ],
    stats: { totalTrades: 156, successRate: 87, totalVolume: 45230 }
  },
  {
    id: '2',
    name: 'Momentum Trader',
    avatar: '📈',
    description: 'Capitalizes on market momentum with quick entry and exit strategies',
    protectionLevel: 'Degen',
    positions: [
      { name: 'Bitcoin ATH', percentage: 82, color: 'bg-orange-500' },
      { name: 'AI Regulation', percentage: 55, color: 'bg-indigo-500' },
      { name: 'Market Crash', percentage: 28, color: 'bg-red-500' }
    ],
    config: {
      targetWallet: '0x8B3d...92C1',
      copyRatio: 0.5,
      retryLimit: 5,
      initialOrderTimeout: 30,
      secondOrderIncrement: 3,
      secondOrderTimeout: 20,
      finalOrderIncrement: 5,
      finalOrderTimeout: 15,
      minPositionSize: 50
    },
    usdcBalance: 12840.75,
    isConnected: true,
    recentTrades: [
      { id: 't3', timestamp: Date.now() - 120000, market: 'Bitcoin ATH', side: 'buy', amount: 500, price: 0.82, status: 'completed' }
    ],
    stats: { totalTrades: 312, successRate: 78, totalVolume: 98450 }
  },
  {
    id: '3',
    name: 'Safe Harbor',
    avatar: '⚓',
    description: 'Conservative approach with risk-managed positions and steady returns',
    protectionLevel: 'Guarded',
    positions: [
      { name: 'S&P500 Positive', percentage: 68, color: 'bg-green-500' },
      { name: 'Inflation < 3%', percentage: 52, color: 'bg-blue-500' },
      { name: 'GDP Growth', percentage: 61, color: 'bg-teal-500' }
    ],
    config: {
      targetWallet: '0x4F2a...B8D5',
      copyRatio: 0.15,
      retryLimit: 2,
      initialOrderTimeout: 60,
      secondOrderIncrement: 1,
      secondOrderTimeout: 40,
      finalOrderIncrement: 2,
      finalOrderTimeout: 30,
      minPositionSize: 5
    },
    usdcBalance: 8650.20,
    isConnected: true,
    recentTrades: [
      { id: 't4', timestamp: Date.now() - 600000, market: 'S&P500 Positive', side: 'buy', amount: 75, price: 0.68, status: 'completed' }
    ],
    stats: { totalTrades: 89, successRate: 94, totalVolume: 23670 }
  },
  {
    id: '4',
    name: 'Political Prophet',
    avatar: '🎯',
    description: 'Specializes in political prediction markets with insider analysis',
    protectionLevel: 'Moderate',
    positions: [
      { name: 'Senate Control', percentage: 58, color: 'bg-purple-500' },
      { name: 'Presidential Race', percentage: 71, color: 'bg-blue-500' },
      { name: 'Policy Change', percentage: 44, color: 'bg-pink-500' }
    ],
    config: {
      targetWallet: '0xA93f...D2E7',
      copyRatio: 0.3,
      retryLimit: 3,
      initialOrderTimeout: 50,
      secondOrderIncrement: 2,
      secondOrderTimeout: 35,
      finalOrderIncrement: 3,
      finalOrderTimeout: 25,
      minPositionSize: 20
    },
    usdcBalance: 7230.80,
    isConnected: true,
    recentTrades: [],
    stats: { totalTrades: 124, successRate: 91, totalVolume: 34560 }
  },
  {
    id: '5',
    name: 'Crypto Degen',
    avatar: '🚀',
    description: 'High-risk high-reward crypto market predictions with aggressive strategies',
    protectionLevel: 'Degen',
    positions: [
      { name: 'SOL > $200', percentage: 88, color: 'bg-purple-600' },
      { name: 'New ATH Soon', percentage: 76, color: 'bg-yellow-500' },
      { name: 'Alt Season', percentage: 92, color: 'bg-green-600' }
    ],
    config: {
      targetWallet: '0xC7E4...F3B9',
      copyRatio: 0.6,
      retryLimit: 5,
      initialOrderTimeout: 25,
      secondOrderIncrement: 4,
      secondOrderTimeout: 15,
      finalOrderIncrement: 6,
      finalOrderTimeout: 10,
      minPositionSize: 100
    },
    usdcBalance: 18950.40,
    isConnected: true,
    recentTrades: [
      { id: 't5', timestamp: Date.now() - 60000, market: 'SOL > $200', side: 'buy', amount: 850, price: 0.88, status: 'executing', executionPhase: { phase: 'primary', status: 'active', attempts: 1, price: 0.88, size: 850 } }
    ],
    stats: { totalTrades: 445, successRate: 72, totalVolume: 156780 }
  },
  {
    id: '6',
    name: 'Macro Maven',
    avatar: '🌍',
    description: 'Focuses on macroeconomic indicators and global market trends',
    protectionLevel: 'Guarded',
    positions: [
      { name: 'Dollar Strength', percentage: 54, color: 'bg-gray-500' },
      { name: 'Oil Price Up', percentage: 47, color: 'bg-amber-600' },
      { name: 'Gold Rally', percentage: 63, color: 'bg-yellow-600' }
    ],
    config: {
      targetWallet: '0x5D8b...A1F6',
      copyRatio: 0.2,
      retryLimit: 3,
      initialOrderTimeout: 55,
      secondOrderIncrement: 1,
      secondOrderTimeout: 35,
      finalOrderIncrement: 3,
      finalOrderTimeout: 25,
      minPositionSize: 15
    },
    usdcBalance: 6780.90,
    isConnected: false,
    recentTrades: [],
    stats: { totalTrades: 67, successRate: 89, totalVolume: 18920 }
  }
];

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<ProtectionLevel>('Moderate');
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [settingsPanelAgent, setSettingsPanelAgent] = useState<TraderAgent | null>(null);
  const [buyModalAgent, setBuyModalAgent] = useState<TraderAgent | null>(null);
  const [withdrawalModalAgent, setWithdrawalModalAgent] = useState<TraderAgent | null>(null);

  // Fetch real agents from database
  const { data: dbAgents, loading: agentsLoading } = useTarobaseData<AgentsResponse[]>(
    subscribeManyAgents,
    true,
    '' // fetch all agents
  );

  // Form state for creating new agent
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    avatarUri: '🤖',
    targetWallet: '',
    copyRatio: '25',
    retryLimit: '3',
    initialOrderTimeout: '45',
    secondOrderIncrement: '2',
    secondOrderTimeout: '30',
    finalOrderIncrement: '4',
    finalOrderTimeout: '20',
    protectionLevel: 'Moderate' as ProtectionLevel,
  });

  // Convert database agents to display format
  const convertedAgents: TraderAgent[] = (dbAgents || []).map(agent => ({
    id: agent.id,
    name: agent.name,
    avatar: agent.avatarUri || '🤖',
    description: agent.description || 'No description provided',
    protectionLevel: agent.protectionLevel as ProtectionLevel,
    positions: [], // Positions would come from API in real implementation
    config: {
      targetWallet: agent.targetWallet.slice(0, 6) + '...' + agent.targetWallet.slice(-4),
      copyRatio: agent.copyRatio / 10000, // Convert from basis points
      retryLimit: agent.retryLimit,
      initialOrderTimeout: agent.initialOrderTimeout,
      secondOrderIncrement: agent.secondOrderIncrement,
      secondOrderTimeout: agent.secondOrderTimeout,
      finalOrderIncrement: agent.finalOrderIncrement,
      finalOrderTimeout: agent.finalOrderTimeout,
      minPositionSize: 10 // Default, would come from agent config
    },
    usdcBalance: 0, // Would come from API
    isConnected: agent.status === 'active',
    recentTrades: [], // Would come from API
    stats: {
      totalTrades: 0,
      successRate: 0,
      totalVolume: 0
    }
  }));

  // Use mock data as fallback when no real agents exist
  const displayAgents = convertedAgents.length > 0 ? convertedAgents : mockTraderAgents;

  const filteredAgents = displayAgents.filter(
    agent => agent.protectionLevel === selectedLevel
  );

  const protectionLevels: ProtectionLevel[] = ['Degen', 'Moderate', 'Guarded'];

  const handleCreateAgent = async () => {
    if (!user) {
      toast.error('Please connect your wallet to create an agent');
      return;
    }

    // Validation
    if (!formData.name.trim()) {
      toast.error('Agent name is required');
      return;
    }
    if (!formData.targetWallet.trim()) {
      toast.error('Target wallet address is required');
      return;
    }

    const copyRatioNum = parseInt(formData.copyRatio);
    if (isNaN(copyRatioNum) || copyRatioNum < 1 || copyRatioNum > 100) {
      toast.error('Copy ratio must be between 1 and 100');
      return;
    }

    setIsCreating(true);
    try {
      const agentId = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const success = await setAgents(agentId, {
        owner: Address.publicKey(user.address),
        name: formData.name,
        description: formData.description || undefined,
        avatarUri: formData.avatarUri,
        targetWallet: Address.publicKey(formData.targetWallet),
        copyRatio: copyRatioNum * 100, // Convert to basis points (25% = 2500)
        retryLimit: parseInt(formData.retryLimit),
        initialOrderTimeout: parseInt(formData.initialOrderTimeout),
        secondOrderIncrement: parseInt(formData.secondOrderIncrement),
        secondOrderTimeout: parseInt(formData.secondOrderTimeout),
        finalOrderIncrement: parseInt(formData.finalOrderIncrement),
        finalOrderTimeout: parseInt(formData.finalOrderTimeout),
        protectionLevel: formData.protectionLevel,
        status: 'inactive',
        createdAt: Time.Now
      });

      if (success) {
        toast.success('Agent created successfully!');
        setIsCreateModalOpen(false);
        // Reset form
        setFormData({
          name: '',
          description: '',
          avatarUri: '🤖',
          targetWallet: '',
          copyRatio: '25',
          retryLimit: '3',
          initialOrderTimeout: '45',
          secondOrderIncrement: '2',
          secondOrderTimeout: '30',
          finalOrderIncrement: '4',
          finalOrderTimeout: '20',
          protectionLevel: 'Moderate',
        });
      } else {
        toast.error('Failed to create agent. Please try again.');
      }
    } catch (error) {
      console.error('Error creating agent:', error);
      toast.error('An error occurred while creating the agent');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      exit={{ opacity: 0 }} 
      variants={staggerContainer} 
      className="min-h-screen bg-black py-8 px-4"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            PolySync
          </h1>
          <p className="text-gray-400 text-lg mb-4">
            Sync to top performing agents and copy their winning strategies
          </p>
          
          {/* Create Agent Button */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg"
                className="bg-white hover:bg-gray-200 text-black shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black border-gray-600">
              <DialogHeader>
                <DialogTitle className="text-2xl text-white">Create Trading Agent</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Configure your automated copy trading agent
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">Basic Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Agent Name *</Label>
                    <Input
                      id="name"
                      placeholder="My Trading Agent"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-black border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-300">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your trading strategy..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-black border-gray-600 text-white"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="avatar" className="text-gray-300">Avatar Emoji</Label>
                      <Input
                        id="avatar"
                        placeholder="🤖"
                        value={formData.avatarUri}
                        onChange={(e) => setFormData({ ...formData, avatarUri: e.target.value })}
                        className="bg-black border-gray-600 text-white"
                        maxLength={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="protectionLevel" className="text-gray-300">Protection Level</Label>
                      <Select
                        value={formData.protectionLevel}
                        onValueChange={(value) => setFormData({ ...formData, protectionLevel: value as ProtectionLevel })}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-gray-600">
                          <SelectItem value="Degen">Degen</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Guarded">Guarded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-600" />

                {/* Trading Configuration */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">Trading Configuration</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="targetWallet" className="text-gray-300">Target Wallet Address *</Label>
                    <Input
                      id="targetWallet"
                      placeholder="Enter Solana wallet address"
                      value={formData.targetWallet}
                      onChange={(e) => setFormData({ ...formData, targetWallet: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white font-mono text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="copyRatio" className="text-gray-300">Copy Ratio (%)</Label>
                      <Input
                        id="copyRatio"
                        type="number"
                        min="1"
                        max="100"
                        value={formData.copyRatio}
                        onChange={(e) => setFormData({ ...formData, copyRatio: e.target.value })}
                        className="bg-black border-gray-600 text-white"
                      />
                      <p className="text-xs text-gray-500">Position size relative to target (1-100%)</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="retryLimit" className="text-gray-300">Retry Limit</Label>
                      <Input
                        id="retryLimit"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.retryLimit}
                        onChange={(e) => setFormData({ ...formData, retryLimit: e.target.value })}
                        className="bg-black border-gray-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-600" />

                {/* Execution Strategy */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">Execution Strategy</h3>
                  
                  <div className="bg-black rounded-lg p-4 border border-gray-600 space-y-3">
                    <p className="text-xs text-blue-400 font-semibold">PRIMARY PHASE</p>
                    <div className="space-y-2">
                      <Label htmlFor="initialTimeout" className="text-gray-300 text-xs">Initial Order Timeout (seconds)</Label>
                      <Input
                        id="initialTimeout"
                        type="number"
                        min="10"
                        value={formData.initialOrderTimeout}
                        onChange={(e) => setFormData({ ...formData, initialOrderTimeout: e.target.value })}
                        className="bg-black border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="bg-black rounded-lg p-4 border border-gray-600 space-y-3">
                    <p className="text-xs text-purple-400 font-semibold">SECONDARY PHASE</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="secondIncrement" className="text-gray-300 text-xs">Price Increment (cents)</Label>
                        <Input
                          id="secondIncrement"
                          type="number"
                          min="0"
                          value={formData.secondOrderIncrement}
                          onChange={(e) => setFormData({ ...formData, secondOrderIncrement: e.target.value })}
                          className="bg-black border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="secondTimeout" className="text-gray-300 text-xs">Timeout (seconds)</Label>
                        <Input
                          id="secondTimeout"
                          type="number"
                          min="10"
                          value={formData.secondOrderTimeout}
                          onChange={(e) => setFormData({ ...formData, secondOrderTimeout: e.target.value })}
                          className="bg-black border-gray-600 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-black rounded-lg p-4 border border-gray-600 space-y-3">
                    <p className="text-xs text-pink-400 font-semibold">FINAL PHASE</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="finalIncrement" className="text-gray-300 text-xs">Price Increment (cents)</Label>
                        <Input
                          id="finalIncrement"
                          type="number"
                          min="0"
                          value={formData.finalOrderIncrement}
                          onChange={(e) => setFormData({ ...formData, finalOrderIncrement: e.target.value })}
                          className="bg-black border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="finalTimeout" className="text-gray-300 text-xs">Timeout (seconds)</Label>
                        <Input
                          id="finalTimeout"
                          type="number"
                          min="10"
                          value={formData.finalOrderTimeout}
                          onChange={(e) => setFormData({ ...formData, finalOrderTimeout: e.target.value })}
                          className="bg-black border-gray-600 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setIsCreateModalOpen(false)}
                    variant="outline"
                    className="flex-1 bg-black border-gray-600 text-white hover:bg-gray-900"
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateAgent}
                    className="flex-1 bg-white hover:bg-gray-200 text-black"
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Agent'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Protection Level Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-black backdrop-blur-sm rounded-lg p-1 border border-gray-600">
            {protectionLevels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-6 py-2.5 rounded-md font-medium transition-all duration-200 ${
                  selectedLevel === level
                    ? 'bg-white text-black shadow-lg'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Agent Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={staggerContainer}
        >
          {filteredAgents.map((agent) => (
            <motion.div key={agent.id} variants={cardVariant}>
              <Card className="bg-black backdrop-blur-sm border-gray-600 hover:border-gray-400 transition-all duration-300 overflow-hidden group">
                <div className="p-6">
                  {/* Agent Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl">{agent.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {agent.name}
                          </h3>
                          <p className="text-sm text-gray-400 leading-relaxed mb-2">
                            {agent.description}
                          </p>
                        </div>
                        <Badge variant={agent.isConnected ? 'default' : 'destructive'} className="ml-2">
                          {agent.isConnected ? 'Connected' : 'Disconnected'}
                        </Badge>
                      </div>
                      {/* Stats Row */}
                      <div className="flex gap-4 text-xs mt-2">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-green-400" />
                          <span className="text-gray-400">{agent.stats.successRate}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="w-3 h-3 text-blue-400" />
                          <span className="text-gray-400">{agent.stats.totalTrades} trades</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-yellow-400" />
                          <span className="text-gray-400">${(agent.stats.totalVolume / 1000).toFixed(1)}k</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Positions */}
                  <div className="mb-5 space-y-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Top Positions
                    </h4>
                    {agent.positions.map((position, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-300">{position.name}</span>
                          <span className="text-gray-400 font-medium">
                            {position.percentage}%
                          </span>
                        </div>
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-600">
                          <div 
                            className="h-full transition-all duration-300 bg-white"
                            style={{ width: `${position.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setBuyModalAgent(agent)}
                      className="flex-1 py-3 rounded-lg font-semibold text-black bg-white hover:bg-gray-200 transition-all duration-200 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Sync with Agent
                    </button>
                    <button 
                      onClick={() => setWithdrawalModalAgent(agent)}
                      className="flex-1 py-3 rounded-lg font-semibold text-white bg-gray-800 hover:bg-gray-700 transition-all duration-200 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Withdraw
                    </button>
                    <button 
                      onClick={() => setSettingsPanelAgent(agent)}
                      className="px-4 py-3 rounded-lg font-semibold text-white bg-gray-800 hover:bg-gray-700 transition-all duration-200 flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
                      className="px-4 py-3 rounded-lg font-semibold text-white bg-gray-800 hover:bg-gray-700 transition-all duration-200 flex items-center gap-2"
                    >
                      {expandedAgent === agent.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Configuration Panel */}
                  {expandedAgent === agent.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-6 space-y-6"
                    >
                      <Separator className="bg-gray-600" />

                      {/* Balance Display */}
                      <div className="bg-black rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">USDC Balance</p>
                            <p className="text-2xl font-bold text-white">${agent.usdcBalance.toFixed(2)}</p>
                          </div>
                          <DollarSign className="w-8 h-8 text-green-400" />
                        </div>
                      </div>

                      {/* Trading Configuration */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Trading Parameters
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                            <Label className="text-xs text-gray-500">Target Wallet</Label>
                            <p className="text-sm text-white font-mono mt-1">{agent.config.targetWallet}</p>
                          </div>
                          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                            <Label className="text-xs text-gray-500">Copy Ratio</Label>
                            <p className="text-sm text-white mt-1">{(agent.config.copyRatio * 100).toFixed(0)}%</p>
                          </div>
                          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                            <Label className="text-xs text-gray-500">Retry Limit</Label>
                            <p className="text-sm text-white mt-1">{agent.config.retryLimit} attempts</p>
                          </div>
                          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                            <Label className="text-xs text-gray-500">Min Position</Label>
                            <p className="text-sm text-white mt-1">${agent.config.minPositionSize}</p>
                          </div>
                        </div>
                      </div>

                      {/* Execution Strategy */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Execution Strategy
                        </h4>
                        <div className="space-y-2">
                          {/* Primary Phase */}
                          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-blue-400 font-semibold">PRIMARY</span>
                              <span className="text-xs text-gray-400">{agent.config.initialOrderTimeout}s timeout</span>
                            </div>
                            <p className="text-xs text-gray-500">Initial order at target price</p>
                          </div>
                          {/* Secondary Phase */}
                          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-purple-400 font-semibold">SECONDARY</span>
                              <span className="text-xs text-gray-400">+${(agent.config.secondOrderIncrement / 100).toFixed(2)} · {agent.config.secondOrderTimeout}s</span>
                            </div>
                            <p className="text-xs text-gray-500">Price adjustment with slight size reduction</p>
                          </div>
                          {/* Final Phase */}
                          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-pink-400 font-semibold">FINAL</span>
                              <span className="text-xs text-gray-400">+${(agent.config.finalOrderIncrement / 100).toFixed(2)} · {agent.config.finalOrderTimeout}s</span>
                            </div>
                            <p className="text-xs text-gray-500">Maximum fill probability attempt</p>
                          </div>
                        </div>
                      </div>

                      {/* Recent Trades */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Recent Activity
                        </h4>
                        {agent.recentTrades.length > 0 ? (
                          <div className="space-y-2">
                            {agent.recentTrades.map((trade) => (
                              <div key={trade.id} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <p className="text-sm text-white font-medium">{trade.market}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {new Date(trade.timestamp).toLocaleTimeString()}
                                    </p>
                                  </div>
                                  <Badge 
                                    variant={trade.status === 'completed' ? 'default' : trade.status === 'failed' ? 'destructive' : 'secondary'}
                                    className="ml-2"
                                  >
                                    {trade.status === 'executing' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                                    {trade.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                                    {trade.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                                    {trade.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-xs">
                                  <span className="text-gray-400">
                                    <span className={trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}>
                                      {trade.side.toUpperCase()}
                                    </span>
                                    {' '}${trade.amount}
                                  </span>
                                  <span className="text-gray-400">@ ${trade.price.toFixed(2)}</span>
                                </div>
                                {trade.executionPhase && (
                                  <div className="mt-2 pt-2 border-t border-slate-700">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-purple-400 font-semibold uppercase">
                                        {trade.executionPhase.phase} Phase
                                      </span>
                                      <span className="text-gray-500">
                                        Attempt {trade.executionPhase.attempts}/{agent.config.retryLimit}
                                      </span>
                                    </div>
                                    <Progress value={(trade.executionPhase.attempts / agent.config.retryLimit) * 100} className="h-1 mt-2" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 text-center">
                            <AlertCircle className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">No recent trades</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Loading State */}
        {agentsLoading && convertedAgents.length === 0 && (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Loading agents...</p>
          </div>
        )}

        {/* Empty State */}
        {!agentsLoading && filteredAgents.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No agents available for this protection level
            </p>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {settingsPanelAgent && (
        <SettingsPanel
          isOpen={!!settingsPanelAgent}
          onClose={() => setSettingsPanelAgent(null)}
          agentId={settingsPanelAgent.id}
          agentName={settingsPanelAgent.name}
          walletAddress={settingsPanelAgent.config.targetWallet}
          protectionLevel={settingsPanelAgent.protectionLevel}
        />
      )}

      {/* Buy Modal */}
      {buyModalAgent && (
        <BuyModal
          isOpen={!!buyModalAgent}
          onClose={() => setBuyModalAgent(null)}
          agentId={buyModalAgent.id}
          agentName={buyModalAgent.name}
          protectionLevel={buyModalAgent.protectionLevel}
        />
      )}

      {/* Withdrawal Modal */}
      {withdrawalModalAgent && (
        <WithdrawalModal
          isOpen={!!withdrawalModalAgent}
          onClose={() => setWithdrawalModalAgent(null)}
          agentId={withdrawalModalAgent.id}
          agentName={withdrawalModalAgent.name}
          availableBalance={withdrawalModalAgent.usdcBalance}
        />
      )}
    </motion.div>
  );
};

export default HomePage;