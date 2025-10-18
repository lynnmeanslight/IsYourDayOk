'use client';

import { useEffect, useState } from 'react';
import { dailyActivityAPI, moodAPI } from '~/lib/api';

interface DashboardProps {
  contracts: any;
}

export function Dashboard({ contracts }: DashboardProps) {
  const { dbUser, userData, loading } = contracts;
  const [dailyActivity, setDailyActivity] = useState<any>(null);
  const [recentMoods, setRecentMoods] = useState<any[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    async function fetchData() {
      if (!dbUser) return;
      
      try {
        const [activity, moods] = await Promise.all([
          dailyActivityAPI.getDailyActivity(dbUser.id, getTodayDate()),
          moodAPI.getMoodLogs(dbUser.id)
        ]);
        setDailyActivity(activity);
        setRecentMoods(moods.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoadingActivity(false);
      }
    }

    fetchData();
  }, [dbUser]);

  if (loading || loadingActivity) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
            {/* Hero Section */}
      <div className="bg-blue-600 text-white rounded-2xl p-8 mb-6 shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Welcome back! 👋</h2>
        <p className="text-blue-50">How are you feeling today?</p>
      </div>

      {/* Stats Grid - Simplified */}
            {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Points</span>
            <span className="text-2xl">�</span>
          </div>
          <div className="text-4xl font-bold text-blue-600">{dbUser?.points || 0}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Current Streak</span>
            <span className="text-2xl">�</span>
          </div>
          <div className="text-4xl font-bold text-blue-600">{dbUser?.currentStreak || 0}</div>
          <div className="text-xs text-gray-500 mt-1">days</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Activities</span>
            <span className="text-2xl">✅</span>
          </div>
          <div className="text-4xl font-bold text-blue-600">{dailyActivity?.activities || 0}</div>
          <div className="text-xs text-gray-500 mt-1">completed</div>
        </div>
      </div>

      {/* Recent Mood Logs */}
      {recentMoods.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <img src="/emojis/calm.png" alt="Mood" className="w-full h-full object-contain drop-shadow-sm" />
            </div>
            <span>Recent Moods</span>
          </h3>
          <div className="space-y-2">
            {recentMoods.map((mood) => (
              <div
                key={mood.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 bg-white rounded-lg p-1.5">
                    {mood.mood === 'great' && <img src="/emojis/happy.png" alt="Great" className="w-full h-full object-contain drop-shadow-sm" />}
                    {mood.mood === 'good' && <img src="/emojis/calm.png" alt="Good" className="w-full h-full object-contain drop-shadow-sm" />}
                    {mood.mood === 'okay' && <img src="/emojis/neutral.png" alt="Okay" className="w-full h-full object-contain drop-shadow-sm" />}
                    {mood.mood === 'not-great' && <img src="/emojis/down.png" alt="Not Great" className="w-full h-full object-contain drop-shadow-sm" />}
                    {mood.mood === 'bad' && <img src="/emojis/sad.png" alt="Bad" className="w-full h-full object-contain drop-shadow-sm" />}
                  </div>
                  <div>
                    <p className="font-medium capitalize">{mood.mood}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(mood.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-4 rounded-full ${
                          i < mood.rating ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{mood.rating}/10</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Activities */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-4">Today's Activities</h3>
        <div className="space-y-3">
          {/* Mood Log */}
          <div className={`flex items-center justify-between p-4 rounded-lg ${
            dailyActivity?.moodLogDone ? 'bg-green-50' : 'bg-gray-50'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                <img src="/emojis/calm.png" alt="Mood" className="w-full h-full object-contain drop-shadow-sm" />
              </div>
              <div>
                <p className="font-medium">Log Mood</p>
                <p className="text-sm text-gray-500">+10 points</p>
              </div>
            </div>
            {dailyActivity?.moodLogDone ? (
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <span className="text-xl">✓</span>
              </div>
            ) : (
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
            )}
          </div>

          {/* Journal */}
          <div className={`flex items-center justify-between p-4 rounded-lg ${
            dailyActivity?.journalDone ? 'bg-green-50' : 'bg-gray-50'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                <img src="/icons/journal.png" alt="Journal" className="w-full h-full object-contain drop-shadow-sm" />
              </div>
              <div>
                <p className="font-medium">Write Journal</p>
                <p className="text-sm text-gray-500">+20 points</p>
              </div>
            </div>
            {dailyActivity?.journalDone ? (
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <span className="text-xl">✓</span>
              </div>
            ) : (
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
            )}
          </div>

          {/* Meditation */}
          <div className={`flex items-center justify-between p-4 rounded-lg ${
            dailyActivity?.meditationDone ? 'bg-green-50' : 'bg-gray-50'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                <img src="/icons/meditation.png" alt="Meditation" className="w-full h-full object-contain drop-shadow-sm" />
              </div>
              <div>
                <p className="font-medium">Meditation</p>
                <p className="text-sm text-gray-500">+30 points • 1 minute</p>
              </div>
            </div>
            {dailyActivity?.meditationDone ? (
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <span className="text-xl">✓</span>
              </div>
            ) : (
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
