import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  agentId: string;
  protectionLevel: string;
}

export const BuyModal: React.FC<BuyModalProps> = ({
  isOpen,
  onClose,
  agentName,
  agentId,
  protectionLevel,
}) => {
  const [amount, setAmount] = useState('0');
  const [currency, setCurrency] = useState('SOL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStopLoss, setShowStopLoss] = useState(false);

  // -- USING MOCK DATA --
  const mockBalance = 10.5;

  const handleMaxClick = () => {
    setAmount(mockBalance.toString());
  };

  const handleSend = async () => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (numAmount > mockBalance) {
      toast.error('Insufficient balance');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Successfully sent ${amount} ${currency} to ${agentName}`);
      setAmount('0');
      onClose();
    } catch (error) {
      toast.error('Transaction failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-black border-gray-600">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            Sync with {agentName}
          </DialogTitle>
          <p className="text-sm text-gray-400 mt-1">
            Fund your sync with this agent's pool
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Token Amount Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Send Tokens</label>
              <Badge 
                variant="outline" 
                className="border-gray-600 text-white"
              >
                {protectionLevel}
              </Badge>
            </div>

            <div className="flex gap-2">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="flex-1 bg-black border-gray-600 text-white text-2xl h-14 font-semibold"
                min="0"
                step="0.01"
              />
              
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-28 bg-black border-gray-600 text-white h-14">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-gray-600">
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleMaxClick}
                variant="outline"
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 h-14 px-6"
              >
                MAX
              </Button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Balance:</span>
              <span className="text-gray-300 font-medium">
                {mockBalance} {currency}
              </span>
            </div>
          </div>

          {/* Stop Loss/Take Profit Toggle */}
          <div>
            <button
              onClick={() => setShowStopLoss(!showStopLoss)}
              className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
            >
              {showStopLoss ? '▼' : '▶'} Show Stop-Loss/Take-Profit Options
            </button>
            
            {showStopLoss && (
              <div className="mt-3 p-4 bg-black rounded-lg border border-gray-600 space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Stop Loss (%)</label>
                  <Input
                    type="number"
                    placeholder="Optional"
                    className="bg-black border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Take Profit (%)</label>
                  <Input
                    type="number"
                    placeholder="Optional"
                    className="bg-black border-gray-600 text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={isProcessing}
            className="w-full bg-white hover:bg-gray-200 text-black h-12 text-base font-semibold"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Sync to Agent Pool'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyModal;
