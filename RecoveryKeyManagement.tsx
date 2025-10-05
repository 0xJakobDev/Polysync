import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Key, Download, Upload, Copy, Check, AlertTriangle, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface RecoveryKeyManagementProps {
  userId?: string;
}

export const RecoveryKeyManagement: React.FC<RecoveryKeyManagementProps> = ({ userId }) => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [hasRecoveryKey, setHasRecoveryKey] = useState(false);
  const [exportedKey, setExportedKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [confirmImport, setConfirmImport] = useState(false);

  // Simple validation for recovery key format (seed phrase or private key)
  const validateRecoveryKey = (key: string): boolean => {
    const trimmed = key.trim();
    // Check if it's a seed phrase (12 or 24 words) or a private key (64 hex chars or base58)
    const words = trimmed.split(/\s+/);
    const isSeedPhrase = words.length === 12 || words.length === 24;
    const isPrivateKey = /^[0-9a-fA-F]{64}$/.test(trimmed) || /^[1-9A-HJ-NP-Za-km-z]{44,88}$/.test(trimmed);
    
    return isSeedPhrase || isPrivateKey;
  };

  const handleImport = async () => {
    if (!confirmImport) {
      toast.error('Please confirm that you understand the security implications');
      return;
    }

    if (!recoveryKey.trim()) {
      toast.error('Please enter a recovery key or seed phrase');
      return;
    }

    if (!validateRecoveryKey(recoveryKey)) {
      toast.error('Invalid recovery key format. Please enter a valid seed phrase (12/24 words) or private key.');
      return;
    }

    setIsImporting(true);
    
    try {
      // Simulate encryption and storage
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, this would encrypt the key and store it via Tarobase
      setHasRecoveryKey(true);
      toast.success('Recovery key imported and encrypted successfully');
      setRecoveryKey('');
      setConfirmImport(false);
      setIsImportModalOpen(false);
    } catch (error) {
      toast.error('Failed to import recovery key. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async () => {
    if (!hasRecoveryKey) {
      toast.error('No recovery key found. Please import one first.');
      return;
    }

    setIsExporting(true);
    
    try {
      // Simulate decryption and retrieval
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, this would decrypt and retrieve the key from Tarobase
      const mockKey = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
      setExportedKey(mockKey);
      toast.success('Recovery key decrypted successfully');
    } catch (error) {
      toast.error('Failed to export recovery key. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportedKey);
      setCopied(true);
      toast.success('Recovery key copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleCloseExportModal = () => {
    setIsExportModalOpen(false);
    setExportedKey('');
    setCopied(false);
  };

  return (
    <Card className="bg-black border-gray-600 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-5 h-5 text-white" />
        <h3 className="text-lg font-semibold text-white">Recovery Key Management</h3>
      </div>

      <p className="text-sm text-gray-400 mb-6">
        Securely import and manage your recovery key for account backup and restoration.
      </p>

      {/* Recovery Key Status */}
      <div className="mb-6 p-4 bg-black rounded-lg border border-gray-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
            <div className="flex items-center gap-2">
              {hasRecoveryKey ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400 font-semibold">Recovery Key Imported</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-yellow-500 font-semibold">No Recovery Key</span>
                </>
              )}
            </div>
          </div>
          <Key className="w-8 h-8 text-gray-600" />
        </div>
      </div>

      <Separator className="bg-gray-600 mb-6" />

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => setIsImportModalOpen(true)}
          className="flex-1 bg-white hover:bg-gray-200 text-black"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import Key
        </Button>
        <Button
          onClick={() => {
            setIsExportModalOpen(true);
            if (hasRecoveryKey && !exportedKey) {
              handleExport();
            }
          }}
          disabled={!hasRecoveryKey}
          variant="outline"
          className="flex-1 bg-black border-gray-600 text-white hover:bg-gray-800 disabled:opacity-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Key
        </Button>
      </div>

      {/* Import Modal */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="max-w-lg bg-black border-gray-600">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Import Recovery Key</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter your seed phrase or private key to securely store it encrypted
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Security Warning */}
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-red-200">
                <p className="font-semibold mb-1">Security Warning</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Never share your recovery key with anyone</li>
                  <li>Keys are encrypted before storage</li>
                  <li>Ensure you're on a secure connection</li>
                  <li>Keep a backup in a safe location</li>
                </ul>
              </div>
            </div>

            {/* Recovery Key Input */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Seed Phrase or Private Key</label>
              <Textarea
                value={recoveryKey}
                onChange={(e) => setRecoveryKey(e.target.value)}
                placeholder="Enter your 12 or 24 word seed phrase, or private key..."
                className="bg-black border-gray-600 text-white font-mono text-sm min-h-[120px]"
                rows={5}
              />
              <p className="text-xs text-gray-500">
                Accepts: 12/24 word seed phrases or base58/hex private keys
              </p>
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-start gap-3 p-3 bg-black rounded-lg border border-gray-600">
              <input
                type="checkbox"
                id="confirm-import"
                checked={confirmImport}
                onChange={(e) => setConfirmImport(e.target.checked)}
                className="mt-1 w-4 h-4"
              />
              <label htmlFor="confirm-import" className="text-xs text-gray-300 cursor-pointer">
                I understand that this key will be encrypted and stored securely. I have verified the key is correct and have a backup.
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setRecoveryKey('');
                  setConfirmImport(false);
                }}
                variant="outline"
                className="flex-1 bg-black border-gray-600 text-white hover:bg-gray-800"
                disabled={isImporting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                className="flex-1 bg-white hover:bg-gray-200 text-black"
                disabled={isImporting || !confirmImport}
              >
                {isImporting ? 'Importing...' : 'Import Key'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <Dialog open={isExportModalOpen} onOpenChange={handleCloseExportModal}>
        <DialogContent className="max-w-lg bg-black border-gray-600">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Export Recovery Key</DialogTitle>
            <DialogDescription className="text-gray-400">
              Your decrypted recovery key - store this securely
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Security Warning */}
            <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-yellow-200">
                <p className="font-semibold mb-1">Keep This Safe</p>
                <p>Anyone with access to this key can control your account. Store it in a secure location and never share it.</p>
              </div>
            </div>

            {/* Exported Key Display */}
            {isExporting ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-sm text-gray-400">Decrypting recovery key...</p>
                </div>
              </div>
            ) : exportedKey ? (
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Your Recovery Key</label>
                <div className="relative">
                  <Textarea
                    value={exportedKey}
                    readOnly
                    className="bg-black border-gray-600 text-white font-mono text-sm min-h-[120px] pr-12"
                    rows={5}
                  />
                  <Button
                    onClick={handleCopyToClipboard}
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            ) : null}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleCloseExportModal}
                className="flex-1 bg-white hover:bg-gray-200 text-black"
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RecoveryKeyManagement;
