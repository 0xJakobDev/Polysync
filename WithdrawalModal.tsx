import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  agentId: string;
  availableBalance: number;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  agentName,
  agentId,
  availableBalance,
}) => {
  const [amount, setAmount] = useState('0');
  const [currency, setCurrency] = useState('SOL');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMaxClick = () => {
    setAmount(availableBalance.toString());
  };

  const handleWithdraw = async () => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (numAmount > availableBalance) {
      toast.error('Withdrawal amount exceeds available balance');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Successfully withdrew ${amount} ${currency} from ${agentName}`);
      setAmount('0');
      onClose();
    } catch (error) {
      toast.error('Withdrawal failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-black border-gray-600">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            Withdraw from {agentName}
          </DialogTitle>
          <p className="text-sm text-gray-400 mt-1">
            Withdraw tokens from this agent's pool back to your wallet
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Warning Alert */}
          <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-200">
              <p className="font-semibold mb-1">Withdrawal Warning</p>
              <p>Withdrawing funds will reduce your agent's trading capacity. Active positions may be affected.</p>
            </div>
          </div>

          {/* Available Balance */}
          <div className="bg-black rounded-lg p-4 border border-gray-600">
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Available Balance</p>
              <p className="text-3xl font-bold text-white">{availableBalance.toFixed(2)}</p>
              <p className="text-sm text-gray-400 mt-1">{currency}</p>
            </div>
          </div>

          {/* Withdrawal Amount Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Withdraw Amount</label>
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
                max={availableBalance}
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
              <span className="text-gray-500">Remaining after withdrawal:</span>
              <span className="text-gray-300 font-medium">
                {(availableBalance - parseFloat(amount || '0')).toFixed(2)} {currency}
              </span>
            </div>
          </div>

          {/* Withdraw Button */}
          <Button
            onClick={handleWithdraw}
            disabled={isProcessing}
            className="w-full bg-white hover:bg-gray-200 text-black h-12 text-base font-semibold"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Withdrawal...
              </>
            ) : (
              'Withdraw to Wallet'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalModal;
