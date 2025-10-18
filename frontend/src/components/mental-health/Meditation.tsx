'use client';

import { useState, useEffect, useRef } from 'react';

interface MeditationProps {
  contracts: any;
}

export function Meditation({ contracts }: MeditationProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds = 1 minute
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [canStart, setCanStart] = useState(true);
  const [checkingEligibility, setCheckingEligibility] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          
          // Voice announcements at key moments
          if (newTime === 45) speak('45 seconds remaining');
          if (newTime === 30) speak('30 seconds remaining. You\'re doing great.');
          if (newTime === 15) speak('15 seconds left. Almost there.');
          if (newTime === 10) speak('10');
          if (newTime < 10 && newTime > 0) speak(newTime.toString());
          if (newTime === 0) speak('Meditation complete. Well done!');
          
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStart = () => {
    if (!canStart) {
      setError('You have already completed your meditation for today!');
      return;
    }

    setIsActive(true);
    setTimeLeft(60);
    setError('');
    speak('Starting 1 minute meditation. Take a deep breath and relax.');
  };

  const handleStop = () => {
    setIsActive(false);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleReset = () => {
    handleStop();
    setTimeLeft(60);
    setError('Meditation session cancelled. You can start again.');
  };

  const handleComplete = async () => {
    setIsActive(false);
    setLoading(true);

    try {
      await contracts.completeMeditation(60); // 60 seconds
      setSuccess(true);
      setCanStart(false);
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to complete meditation');
    } finally {
      setLoading(false);
    }
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
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Meditation</h2>
          <p className="text-gray-500">
            1 minute • Earn <span className="font-semibold text-blue-600">30 points</span>
          </p>
          {!canStart && (
            <p className="text-sm text-green-600 mt-2">✓ Completed today</p>
          )}
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
              <span className="text-7xl font-bold text-blue-600">{formatTime(timeLeft)}</span>
              {isActive && (
                <span className="text-sm text-gray-500 mt-3 animate-pulse">Breathe...</span>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          {!isActive && timeLeft === 60 && (
            <button
              onClick={handleStart}
              disabled={!canStart || loading}
              className="w-full bg-blue-600 text-white rounded-2xl px-6 py-5 font-semibold text-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {!canStart ? '✓ Completed Today' : '🧘 Start Meditation'}
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

        {/* Simple Tips */}
        <details className="mt-6 group">
          <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <span>💡</span>
            <span>Meditation tips</span>
            <span className="ml-auto group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <ul className="mt-3 text-sm text-gray-600 space-y-2 pl-6">
            <li>• Find a quiet place</li>
            <li>• Close your eyes</li>
            <li>• Focus on breathing</li>
            <li>• Listen to voice guidance</li>
          </ul>
        </details>
      </div>
    </div>
  );
}
