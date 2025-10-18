'use client';

import { useState } from 'react';

interface MoodLogProps {
  contracts: any;
}

const moods = [
  { emoji: '/emojis/happy.png', label: 'Happy', value: 'happy' },
  { emoji: '/emojis/calm.png', label: 'Calm', value: 'calm' },
  { emoji: '/emojis/neutral.png', label: 'Neutral', value: 'neutral' },
  { emoji: '/emojis/down.png', label: 'Not Great', value: 'not-great' },
  { emoji: '/emojis/sad.png', label: 'Sad', value: 'sad' },
];

export function MoodLog({ contracts }: MoodLogProps) {
  const [selectedMood, setSelectedMood] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMood) {
      setError('Please select a mood');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await contracts.logMood(selectedMood, rating);
      setSuccess(true);
      setSelectedMood('');
      setRating(5);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to log mood');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">How are you feeling?</h2>
          <p className="text-gray-500">
            Earn <span className="font-semibold text-blue-600">10 points</span> for each mood log
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Mood Selection */}
          <div>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood.value)}
                  className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl transition-all duration-200 ${
                    selectedMood === mood.value
                      ? 'bg-blue-50 ring-2 ring-blue-600 scale-105 sm:scale-110'
                      : 'bg-white hover:bg-gray-50 hover:scale-105 border border-gray-200'
                  } shadow-sm min-h-[90px] sm:min-h-[110px]`}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mb-2 flex items-center justify-center">
                    <img 
                      src={mood.emoji} 
                      alt={mood.label} 
                      className="w-full h-full object-contain drop-shadow-sm" 
                    />
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-600 font-medium text-center capitalize leading-tight">
                    {mood.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Rating Slider */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100">
            <label className="block text-sm font-medium mb-4 text-center">
              Rate intensity
            </label>
            <div className="space-y-4">
              <input
                type="range"
                min="1"
                max="10"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="text-center">
                <div className="inline-flex items-center gap-1 bg-blue-600 text-white px-6 py-2 rounded-full">
                  <span className="text-2xl font-bold">{rating}</span>
                  <span className="text-sm">/10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <p className="text-sm text-blue-600 font-medium">
                ✓ Mood logged successfully! +10 points
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !selectedMood}
            className="w-full bg-blue-600 text-white rounded-2xl px-6 py-4 font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? 'Logging...' : 'Log Mood'}
          </button>
        </form>
      </div>
    </div>
  );
}
