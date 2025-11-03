'use client';

import { useAccount } from 'wagmi';
import { truncateAddress } from '~/lib/truncateAddress';
import { useEffect, useState } from 'react';
import { journalAPI, meditationAPI, moodAPI, nftAPI } from '~/lib/api';
import { getName } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';

interface ProfileProps {
  contracts: any;
  onMintClick: (achievement: any) => void;
}

interface UserStats {
  totalPoints: number;
  journalStreak: number;
  meditationStreak: number;
  totalJournals: number;
  totalMeditations: number;
  totalMoods: number;
  nftCount: number;
}

export function Profile({ contracts, onMintClick }: ProfileProps) {
  const { address } = useAccount();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [journals, setJournals] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [selectedJournal, setSelectedJournal] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'history' | 'nfts'>('stats');
  const [basename, setBasename] = useState<string | null>(null);

  // Achievement type definitions with display metadata
  const achievementTypes = [
    {
      id: 'journal-7',
      title: '7-Day Journal Streak',
      description: 'Complete 7 consecutive days of journaling',
      icon: '/icons/journal.png',
      days: 7,
    },
    {
      id: 'journal-30',
      title: '30-Day Journal Streak',
      description: 'Complete 30 consecutive days of journaling',
      icon: '/icons/journal.png',
      days: 30,
    },
    {
      id: 'meditation-7',
      title: '7-Day Meditation Streak',
      description: 'Complete 7 consecutive days of meditation',
      icon: '/icons/meditation.png',
      days: 7,
    },
    {
      id: 'meditation-30',
      title: '30-Day Meditation Streak',
      description: 'Complete 30 consecutive days of meditation',
      icon: '/icons/trophy.png',
      days: 30,
    },
  ];

  // Fetch Basename for the connected address
  useEffect(() => {
    async function fetchBasename() {
      if (!address) {
        setBasename(null);
        return;
      }

      try {
        const name = await getName({ address, chain: base });
        setBasename(name);
      } catch (error) {
        console.error('Error fetching Basename:', error);
        setBasename(null);
      }
    }

    fetchBasename();
  }, [address]);

  useEffect(() => {
    async function loadStats() {
      if (!contracts.dbUser && !contracts.userData) {
        setLoading(false);
        return;
      }

      try {
        const points = contracts.userData?.totalPoints 
          ? Number(contracts.userData.totalPoints) 
          : (contracts.dbUser?.points || 0);
        
        const journalStreak = contracts.userData?.journalStreak 
          ? Number(contracts.userData.journalStreak) 
          : (contracts.dbUser?.journalStreak || 0);
        
        const meditationStreak = contracts.userData?.meditationStreak 
          ? Number(contracts.userData.meditationStreak) 
          : (contracts.dbUser?.meditationStreak || 0);

        let journalsCount = 0;
        let meditations = 0;
        let moods = 0;

        if (contracts.dbUser?.id) {
          try {
            const [journalsData, meditationsData, moodsData] = await Promise.all([
              journalAPI.getJournals(contracts.dbUser.id),
              meditationAPI.getMeditations(contracts.dbUser.id),
              moodAPI.getMoodLogs(contracts.dbUser.id),
            ]);

            journalsCount = journalsData?.length || 0;
            meditations = meditationsData?.length || 0;
            moods = moodsData?.length || 0;
            setJournals(journalsData || []);
          } catch (err) {
            console.error('Error fetching activity data:', err);
          }
        }

        if (contracts.dbUser?.id) {
          try {
            const achievementsData = await nftAPI.getAchievements(contracts.dbUser.id);
            
            // Transform raw database achievements with display metadata
            const enrichedAchievements = achievementsData.map((ach: any) => {
              const metadata = achievementTypes.find(t => t.id === ach.type);
              
              // Determine current progress based on achievement type
              let current = 0;
              if (ach.type.includes('journal')) {
                current = journalStreak;
              } else if (ach.type.includes('meditation')) {
                current = meditationStreak;
              }
              
              // Determine status
              let status = 'locked';
              if (ach.minted) {
                status = 'minted';
              } else if (current >= ach.days) {
                status = 'unlocked';
              } else if (current > 0) {
                status = 'in-progress';
              }
              
              return {
                ...ach,
                title: metadata?.title || ach.type,
                description: metadata?.description || '',
                icon: metadata?.icon || '/icons/trophy.png',
                target: ach.days,
                current,
                status,
              };
            });
            
            setAchievements(enrichedAchievements || []);
          } catch (err) {
            console.error('Error fetching achievements:', err);
          }
        }

        const nftCount = achievements.filter((a) => a.minted).length;

        setStats({
          totalPoints: points,
          journalStreak,
          meditationStreak,
          totalJournals: journalsCount,
          totalMeditations: meditations,
          totalMoods: moods,
          nftCount,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [contracts.userData, contracts.dbUser, achievements.length]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header - Minimalist */}
      <div className="bg-white rounded-3xl p-6 text-center">
        {contracts.farcasterUser?.pfpUrl ? (
          <img 
            src={contracts.farcasterUser.pfpUrl} 
            alt="Profile" 
            className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-gray-100" 
          />
        ) : (
          <div className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-gray-100 overflow-hidden bg-gray-50">
            <img src="/icons/profile.PNG" alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          {contracts.farcasterUser?.displayName || contracts.farcasterUser?.username || basename || (address ? truncateAddress(address) : 'Anonymous')}
        </h1>
        {contracts.farcasterUser?.username && (
          <p className="text-sm text-gray-500">@{contracts.farcasterUser.username}</p>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl p-1.5">
        <div className="grid grid-cols-3 gap-1">
          <button 
            onClick={() => setActiveTab('stats')} 
            className={`py-3 px-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'stats' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Stats
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            className={`py-3 px-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'history' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Journals
          </button>
          <button 
            onClick={() => setActiveTab('nfts')} 
            className={`py-3 px-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'nfts' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            NFTs
          </button>
        </div>
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* Points - Large and Centered */}
          <div className="bg-white rounded-3xl p-8 text-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">{stats?.totalPoints || 0}</div>
            <p className="text-gray-500">Total Points</p>
          </div>

          {/* Streaks - Clean Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats?.journalStreak || 0}</div>
              <p className="text-sm text-gray-500">Journal Streak</p>
            </div>
            <div className="bg-white rounded-2xl p-5 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats?.meditationStreak || 0}</div>
              <p className="text-sm text-gray-500">Meditation Streak</p>
            </div>
          </div>

          {/* Activity Stats - Minimalist List */}
          <div className="bg-white rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-600">Journals</span>
                <span className="text-lg font-semibold text-gray-900">{stats?.totalJournals || 0}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-600">Meditations</span>
                <span className="text-lg font-semibold text-gray-900">{stats?.totalMeditations || 0}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-600">Mood Logs</span>
                <span className="text-lg font-semibold text-gray-900">{stats?.totalMoods || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">NFTs Earned</span>
                <span className="text-lg font-semibold text-gray-900">{stats?.nftCount || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {journals.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-3 opacity-30">
                <img src="/icons/journal.png" alt="Journal" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">No journals yet</h3>
              <p className="text-sm text-gray-500">Start writing to track your journey</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">{journals.length} entries</span>
              </div>
              <div className="space-y-3">
                {journals.map((journal) => (
                  <div 
                    key={journal.id} 
                    className="pb-3 border-b border-gray-100 last:border-0 last:pb-0 cursor-pointer hover:opacity-70 transition-opacity"
                    onClick={() => setSelectedJournal(journal)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">{formatDate(journal.createdAt)}</span>
                      <span className="text-xs font-medium text-blue-600">+{journal.points}</span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{journal.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* NFTs Tab */}
      {activeTab === 'nfts' && (
        <div className="space-y-4">
          {achievements.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-3 opacity-30">
                <img src="/icons/trophy.png" alt="Trophy" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">No achievements yet</h3>
              <p className="text-sm text-gray-500">Keep building streaks to unlock NFTs</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Achievements</h2>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <img src={achievement.icon} alt={achievement.title} className="w-8 h-8 object-contain" />
                        <div>
                          <h3 className="font-semibold text-sm text-gray-900">{achievement.title}</h3>
                          <p className="text-xs text-gray-500">{achievement.current}/{achievement.target}</p>
                        </div>
                      </div>
                      {achievement.status === 'unlocked' && !achievement.minted && (
                        <button 
                          onClick={() => onMintClick(achievement)} 
                          className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                        >
                          Mint
                        </button>
                      )}
                      {achievement.minted && (
                        <span className="text-xs text-green-600 font-medium">✓ Minted</span>
                      )}
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all" 
                        style={{ width: `${(achievement.current / achievement.target) * 100}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Journal Detail Modal */}
      {selectedJournal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" 
          onClick={() => setSelectedJournal(null)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[70vh] overflow-y-auto" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4 pb-3 border-b border-gray-100">
              <div>
                <span className="text-sm text-gray-500">{formatDate(selectedJournal.createdAt)}</span>
                <p className="text-xs font-medium text-blue-600 mt-1">+{selectedJournal.points} points</p>
              </div>
              <button 
                onClick={() => setSelectedJournal(null)} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedJournal.content}</p>
          </div>
        </div>
      )}
    </div>
  );
}
