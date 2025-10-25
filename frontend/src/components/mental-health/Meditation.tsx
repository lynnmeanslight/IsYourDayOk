'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';

interface MeditationProps {
  contracts: any;
}

export function Meditation({ contracts }: MeditationProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds = 1 minute
  const [preparationTime, setPreparationTime] = useState(0); // 5 second prep countdown
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [canStart, setCanStart] = useState(true);
  const [checkingEligibility, setCheckingEligibility] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  useEffect(() => {
    async function checkMeditationEligibility() {
      try {
        const eligible = await contracts.canMeditateToday();
        setCanStart(eligible);
      } catch (err) {
        console.error('Error checking meditation eligibility:', err);
      } finally {
        setCheckingEligibility(false);
      }
    }

    checkMeditationEligibility();
  }, [contracts]);

  // Handle preparation countdown (5 seconds)
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (preparationTime > 0) {
      interval = setInterval(() => {
        setPreparationTime((prev) => {
          const newTime = prev - 1;
          
          // Only count down last 3 seconds
          if (newTime === 3 || newTime === 2 || newTime === 1) {
            speak(newTime.toString(), true);
          } else if (newTime === 0) {
            speak('Begin', true);
            setIsActive(true); // Start the actual meditation
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [preparationTime]);

  const handleComplete = useCallback(async () => {
    setIsActive(false);
    setLoading(true);

    try {
      // Check if on correct chain, switch if needed
      if (chain?.id !== base.id) {
        setError('Switching to Base...');
        await switchChainAsync({ chainId: base.id });
        setError('');
      }

      await contracts.completeMeditation(60); // 60 seconds
      setSuccess(true);
      setCanStart(false);
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      if (err.message?.includes('chain')) {
        setError('Please switch to Base network in your wallet');
      } else {
        setError(err.message || 'Failed to complete meditation');
      }
    } finally {
      setLoading(false);
    }
  }, [contracts, chain, switchChainAsync]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          
          // Minimal voice announcements - only at critical moments
          if (newTime === 30) speak('Halfway there', false);
          if (newTime === 10) speak('10 seconds', false);
          if (newTime === 0) {
            speak('Complete', true);
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Handle completion when timer reaches 0
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      handleComplete();
    }
  }, [timeLeft, isActive, handleComplete]);

  const speak = (text: string, priority: boolean = false) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech for priority messages or to prevent queue buildup
      if (priority || window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      
      // Small delay to ensure cancel completes
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
      }, priority ? 100 : 50);
    }
  };

  const handleStart = () => {
    if (!canStart) {
      setError('You have already completed your meditation for today!');
      return;
    }

    // Cancel any ongoing speech first
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setPreparationTime(5); // Start 5-second preparation countdown
    setTimeLeft(60);
    setError('');
    
    // Brief start message
    setTimeout(() => {
      speak('Get ready', true);
    }, 200);
  };

  const handleStop = () => {
    setIsActive(false);
    setPreparationTime(0); // Also stop preparation if paused during prep
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleReset = () => {
    handleStop();
    setTimeLeft(60);
    setPreparationTime(0);
    setError('Meditation session cancelled. You can start again.');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((60 - timeLeft) / 60) * 100;

  if (checkingEligibility) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">Meditation</h2>
          <p className="text-gray-500">
            1 minute • Earn <span className="font-semibold text-blue-600">30 points</span>
          </p>
          {!canStart && (
            <p className="text-sm text-green-600 mt-2">✓ Completed today</p>
          )}
        </div>

        {/* Quick Tips - Moved to top */}
        <div className="mb-6 bg-blue-50 rounded-xl p-3 border border-blue-100">
          <div className="flex items-start gap-2 text-xs text-gray-700">
            <span className="text-sm flex-shrink-0">💡</span>
            <div className="flex-1">
              <span className="font-medium text-gray-900">Quick tips: </span>
              Find a quiet place, relax your body, focus on your breathing
            </div>
          </div>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            {/* Progress Circle */}
            <svg className="w-64 h-64 transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="#f0f0f0"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="#3b82f6"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {preparationTime > 0 ? (
                <>
                  <span className="text-7xl font-bold text-blue-600 animate-pulse">{preparationTime}</span>
                  <span className="text-sm text-gray-500 mt-3">Get ready...</span>
                </>
              ) : (
                <>
                  <span className="text-7xl font-bold text-blue-600">{formatTime(timeLeft)}</span>
                  {isActive && (
                    <span className="text-sm text-gray-500 mt-3 animate-pulse">Breathe...</span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          {!isActive && !preparationTime && timeLeft === 60 && (
            <button
              onClick={handleStart}
              disabled={!canStart || loading}
              className="w-full bg-blue-600 text-white rounded-2xl px-6 py-5 font-semibold text-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {!canStart ? '✓ Completed Today' : '🧘 Start Meditation'}
            </button>
          )}

          {preparationTime > 0 && (
            <button
              onClick={handleReset}
              className="w-full bg-gray-600 text-white rounded-2xl px-6 py-5 font-semibold text-lg hover:bg-gray-700 transition-all shadow-lg"
            >
              ✕ Cancel Preparation
            </button>
          )}

          {isActive && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleStop}
                className="w-full bg-gray-400 text-white rounded-xl px-6 py-4 font-semibold hover:bg-gray-500 transition-colors"
              >
                ⏸ Pause
              </button>
              <button
                onClick={handleReset}
                className="w-full bg-gray-600 text-white rounded-xl px-6 py-4 font-semibold hover:bg-gray-700 transition-colors"
              >
                ✕ Cancel
              </button>
            </div>
          )}

          {!isActive && timeLeft < 60 && timeLeft > 0 && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsActive(true)}
                className="w-full bg-blue-600 text-white rounded-xl px-6 py-4 font-semibold hover:bg-blue-700 transition-colors"
              >
                ▶ Resume
              </button>
              <button
                onClick={handleReset}
                className="w-full bg-gray-400 text-white rounded-xl px-6 py-4 font-semibold hover:bg-gray-500 transition-colors"
              >
                ↺ Restart
              </button>
            </div>
          )}

          {timeLeft === 0 && loading && (
            <div className="w-full bg-blue-600 text-white rounded-xl px-6 py-4 font-semibold text-center">
              Saving...
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <p className="text-sm text-blue-600 font-medium">
              ✓ Meditation complete! +30 points & streak extended
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
