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
  const [stats, setStats] = useState({
    totalPoints: 0,
    currentStreak: 0,
    activitiesCompleted: 0,
  });

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

        // Calculate stats - prioritize blockchain data
        const points = userData?.totalPoints 
          ? Number(userData.totalPoints) 
          : (dbUser?.points || 0);

        const journalStreak = userData?.journalStreak 
          ? Number(userData.journalStreak) 
          : (dbUser?.journalStreak || 0);

        const meditationStreak = userData?.meditationStreak 
          ? Number(userData.meditationStreak) 
          : (dbUser?.meditationStreak || 0);

        // Current streak is the max of journal and meditation streaks
        const currentStreak = Math.max(journalStreak, meditationStreak);

        // Count today's completed activities
        let activitiesCompleted = 0;
        if (activity?.moodLogDone) activitiesCompleted++;
        if (activity?.journalDone) activitiesCompleted++;
        if (activity?.meditationDone) activitiesCompleted++;

        setStats({
          totalPoints: points,
          currentStreak,
          activitiesCompleted,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoadingActivity(false);
      }
    }

    fetchData();
  }, [dbUser, userData]);

  if (loading || loadingActivity) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Hero Section - Mobile Optimized */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-3xl p-5 shadow-sm">
        <h2 className="text-xl font-bold mb-1">Is Your Day Ok?</h2>
        <p className="text-white/90 text-sm">Track your mental wellness journey</p>
      </div>

      {/* Stats Grid - Mobile Vertical Stack */}
      <div className="space-y-3">
        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Points</span>
          </div>
          <div className="text-4xl font-bold text-blue-600">{stats.totalPoints}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Current Streak</span>
          </div>
          <div className="text-4xl font-bold text-blue-600">{stats.currentStreak}</div>
          <div className="text-xs text-gray-500 mt-1">days</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Today's Activities</span>
          </div>
          <div className="text-4xl font-bold text-blue-600">{stats.activitiesCompleted}/3</div>
          <div className="text-xs text-gray-500 mt-1">completed</div>
        </div>
      </div>

      {/* Recent Mood Logs */}
      {recentMoods.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-1.5 shadow-sm">
              <img src="/emojis/calm.png" alt="Mood" className="w-full h-full object-contain" />
            </div>
            <span>Recent Moods</span>
          </h3>
          <div className="space-y-2">
            {recentMoods.map((mood) => (
              <div
                key={mood.id}
                className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg hover:from-gray-100 hover:to-gray-150 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 bg-white rounded-xl shadow-sm p-2">
                    {mood.mood === 'happy' && <img src="/emojis/happy.png" alt="Happy" className="w-full h-full object-contain" />}
                    {mood.mood === 'calm' && <img src="/emojis/calm.png" alt="Calm" className="w-full h-full object-contain" />}
                    {mood.mood === 'neutral' && <img src="/emojis/neutral.png" alt="Neutral" className="w-full h-full object-contain" />}
                    {mood.mood === 'not-great' && <img src="/emojis/down.png" alt="Not Great" className="w-full h-full object-contain" />}
                    {mood.mood === 'sad' && <img src="/emojis/sad.png" alt="Sad" className="w-full h-full object-contain" />}
                  </div>
                  <div>
                    <p className="font-medium capitalize">{mood.mood.replace('-', ' ')}</p>
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
            dailyActivity?.moodLogDone ? 'bg-blue-50 border border-blue-200' : 'bg-gradient-to-br from-gray-50 to-gray-100'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-white rounded-xl shadow-sm p-1.5">
                <img src="/emojis/calm.png" alt="Mood" className="w-full h-full object-contain" />
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
            dailyActivity?.journalDone ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
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
            dailyActivity?.meditationDone ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
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
