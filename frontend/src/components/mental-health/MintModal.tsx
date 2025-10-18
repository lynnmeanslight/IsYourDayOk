'use client';

import { useState } from 'react';

interface MintModalProps {
  achievement: any;
  contracts: any;
  onClose: () => void;
}

export function MintModal({ achievement, contracts, onClose }: MintModalProps) {
  const [improvementRating, setImprovementRating] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'rating' | 'minting' | 'success'>('rating');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (improvementRating < 1 || improvementRating > 100) {
      setError('Please provide a rating between 1 and 100');
      return;
    }

    setLoading(true);
    setError('');
    setStep('minting');

    try {
      // Step 1: Create achievement record with improvement rating
      const newAchievement = await contracts.createAchievement(
        achievement.id,
        achievement.days,
        improvementRating
      );

      // Step 2: Mint NFT (this would call the actual NFT contract)
      // For now, we'll simulate with a mock transaction
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate blockchain tx
      
      const mockTokenId = `0x${Math.random().toString(16).slice(2)}`;
      const mockTxHash = `0x${Math.random().toString(16).slice(2)}`;
      
      // Step 3: Update achievement with mint data
      await contracts.updateAchievementMint(
        newAchievement.id,
        mockTokenId,
        '0xYourNFTContractAddress', // Replace with actual NFT contract
        mockTxHash
      );

      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Failed to mint NFT');
      setStep('rating');
    } finally {
      setLoading(false);
    }
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 90) return 'Significantly Improved! 🌟';
    if (rating >= 70) return 'Much Better! 💪';
    if (rating >= 50) return 'Moderately Better 👍';
    if (rating >= 30) return 'Slightly Better 🙂';
    return 'About the Same 😊';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 70) return 'text-green-600';
    if (rating >= 40) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {step === 'rating' && (
          <>
            <div className="text-center mb-6">
              <span className="text-6xl mb-4 block">{achievement.emoji}</span>
              <h3 className="text-2xl font-bold mb-2">{achievement.title}</h3>
              <p className="text-muted-foreground">
                {achievement.days} Day Streak Achievement
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">
                  How has your mood and mental health improved?
                </label>
                <p className="text-xs text-muted-foreground mb-4">
                  Rate your improvement from when you started to now (1-100)
                </p>

                {/* Rating Slider */}
                <div className="space-y-3">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={improvementRating}
                    onChange={(e) => setImprovementRating(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getRatingColor(improvementRating)}`}>
                      {improvementRating}/100
                    </div>
                    <div className={`text-sm font-medium mt-1 ${getRatingColor(improvementRating)}`}>
                      {getRatingLabel(improvementRating)}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>No Change</span>
                    <span>Massive Improvement</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-border rounded-lg px-4 py-3 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-white rounded-lg px-4 py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mint NFT
                </button>
              </div>
            </form>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-900">
                <strong>Note:</strong> Your improvement rating will be permanently stored on the blockchain with your NFT.
              </p>
            </div>
          </>
        )}

        {step === 'minting' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>
            <h3 className="text-xl font-bold mb-2">Minting Your NFT...</h3>
            <p className="text-muted-foreground text-sm">
              Please wait while we create your achievement NFT on the blockchain.
              This may take a few moments.
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
            <p className="text-muted-foreground mb-4">
              Your {achievement.title} NFT has been successfully minted!
            </p>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
              <p className="text-sm text-green-900">
                <strong>Improvement Rating:</strong> {improvementRating}/100
              </p>
              <p className="text-xs text-green-700 mt-1">
                {getRatingLabel(improvementRating)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-primary text-white rounded-lg px-6 py-3 font-medium hover:opacity-90 transition-opacity"
            >
              View My Achievements
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
