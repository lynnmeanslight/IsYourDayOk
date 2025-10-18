"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useFrameContext } from "./providers/FrameProvider";
import { useContracts } from "~/lib/useContracts";
import { useAutoSwitchChain } from "~/lib/useAutoSwitchChain";
import { Dashboard } from "./mental-health/Dashboard";
import { MoodLog } from "./mental-health/MoodLog";
import { Journal } from "./mental-health/Journal";
import { JournalView } from "./mental-health/JournalView";
import { Meditation } from "./mental-health/Meditation";
import { Achievements } from "./mental-health/Achievements";
import { ChatRoom } from "./mental-health/ChatRoom";
import { MintModal } from "./mental-health/MintModal";
import { truncateAddress } from "~/lib/truncateAddress";
import { useConnect, useDisconnect } from "wagmi";
import { config } from "./providers/WagmiProvider";

type View =
  | "dashboard"
  | "mood"
  | "journal"
  | "journal-view"
  | "meditation"
  | "achievements"
  | "chat";

export function MentalHealth() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const frameContext = useFrameContext();
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [showMintModal, setShowMintModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  
  // Auto-switch to Base Sepolia
  const { isCorrectChain, isSwitching, switchError } = useAutoSwitchChain();

  const farcasterUser =
    frameContext?.context && "user" in frameContext.context
      ? {
          fid: (frameContext.context as any).user.fid?.toString(),
          username: (frameContext.context as any).user.username,
          displayName: (frameContext.context as any).user.displayName,
          pfpUrl: (frameContext.context as any).user.pfpUrl,
        }
      : undefined;

  const contracts = useContracts(farcasterUser);

  const navItems = [
    { id: "dashboard", icon: "🏠", label: "Dashboard", isEmoji: true },
    { id: "mood", icon: "/emojis/calm.png", label: "Mood", isEmoji: false },
    { id: "journal", icon: "/icons/book.png", label: "Journal", isEmoji: false },
    { id: "journal-view", icon: "/icons/journal.png", label: "History", isEmoji: false },
    { id: "meditation", icon: "/icons/meditation.png", label: "Meditate", isEmoji: false },
    { id: "achievements", icon: "/icons/trophy.png", label: "NFTs", isEmoji: false },
    { id: "chat", icon: "/icons/channel.png", label: "Community", isEmoji: false },
  ];

  const handleMintClick = (achievement: any) => {
    setSelectedAchievement(achievement);
    setShowMintModal(true);
  };

  // Show switching network screen
  if (isConnected && isSwitching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Switching to Base Sepolia...</p>
          <p className="text-sm text-gray-500 mt-2">Please confirm in your wallet</p>
        </div>
      </div>
    );
  }

  // Show error if chain switch failed
  if (isConnected && switchError && !isCorrectChain) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Wrong Network</h2>
          <p className="text-gray-600 mb-4">
            Please switch to Base Sepolia network to use this app.
          </p>
          <p className="text-sm text-red-600 mb-4">{switchError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (contracts.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header - Simplified */}
        <header className="mb-6 flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <img 
              src="/icons/IsYourDayOkfinal.png" 
              alt="IsYourDayOk Logo" 
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold">IsYourDayOk</h1>
              <p className="text-sm text-gray-500">
                Your mental health companion
              </p>
            </div>
          </div>

          {/* Wallet Status */}
          <div className="flex items-center gap-3">
            {farcasterUser?.pfpUrl && (
              <img
                src={farcasterUser.pfpUrl}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover border-2 border-blue-500"
              />
            )}
            {/* {isConnected && address ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium">
                    {truncateAddress(address)}
                  </div>
                </div>
                <button
                  onClick={() => disconnect()}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => connect({ connector: config.connectors[0] })}
                className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Connect Wallet
              </button>
            )} */}
          </div>
        </header>

        {/* Navigation - Mobile Optimized & Simplified */}
        <nav className="mb-6">
          {/* Desktop/Tablet: Clean Tabs */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm p-2">
            <div className="flex gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as View)}
                  aria-current={currentView === item.id ? 'page' : undefined}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    currentView === item.id
                      ? "text-blue-600 ring-2 ring-blue-500/30 bg-transparent"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.isEmoji ? (
                    <span className="text-lg">{item.icon}</span>
                  ) : (
                    <img 
                      src={item.icon} 
                      alt={item.label} 
                      className="w-5 h-5 object-contain"
                    />
                  )}
                  <span className="hidden lg:inline text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile: Page Title Only */}
          {/* Mobile Page Title */}
          <div className="md:hidden mb-4">
            {/* <div className="bg-white rounded-2xl shadow-sm p-4 border-2 border-blue-100"> */}
            {/* <div className="flex items-center gap-3 justify-center">
            <span className="text-3xl">{navItems.find(item => item.id === currentView)?.icon}</span>
            <h2 className="text-xl font-bold text-gray-800">
              {navItems.find(item => item.id === currentView)?.label}
            </h2>
          </div> */}
            {/* </div> */}
          </div>
        </nav>

        {/* Main Content */}
        <main>
          {currentView === "dashboard" && <Dashboard contracts={contracts} />}
          {currentView === "mood" && <MoodLog contracts={contracts} />}
          {currentView === "journal" && <Journal contracts={contracts} />}
          {currentView === "journal-view" && (
            <JournalView contracts={contracts} />
          )}
          {currentView === "meditation" && <Meditation contracts={contracts} />}
          {currentView === "achievements" && (
            <Achievements contracts={contracts} onMintClick={handleMintClick} />
          )}
          {currentView === "chat" && <ChatRoom contracts={contracts} />}
        </main>

        {/* Mint Modal */}
        {showMintModal && selectedAchievement && (
          <MintModal
            achievement={selectedAchievement}
            contracts={contracts}
            onClose={() => {
              setShowMintModal(false);
              setSelectedAchievement(null);
            }}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation - Cleaner Design */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 safe-area-pb">
        <div className="grid grid-cols-4 gap-1 p-1 bg-white">
          {navItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
                aria-current={currentView === item.id ? 'page' : undefined}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all ${
                  currentView === item.id 
                    ? "text-blue-600 ring-1 ring-blue-500/30 bg-transparent" 
                    : "text-gray-500"
                }`}
            >
              <div className="w-7 h-7 mb-1 flex items-center justify-center">
                {item.isEmoji ? (
                  <span className="text-2xl">{item.icon}</span>
                ) : (
                  <img 
                    src={item.icon} 
                    alt={item.label} 
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <span className="text-xs font-medium">{item.label === 'Dashboard' ? 'Home' : item.label}</span>
            </button>
          ))}
        </div>

        {/* Secondary actions - More Minimal */}
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="flex justify-center gap-2 px-4 py-2">
            {navItems.slice(4, 7).map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as View)}
                aria-current={currentView === item.id ? 'page' : undefined}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  currentView === item.id
                    ? "text-blue-600 ring-2 ring-blue-500/30 bg-transparent"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {item.isEmoji ? (
                  <span className="text-sm">{item.icon}</span>
                ) : (
                  <img 
                    src={item.icon} 
                    alt={item.label} 
                    className="w-4 h-4 object-contain"
                  />
                )}
                <span>{item.label === 'Community' ? 'Chat' : item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spacer for mobile bottom nav */}
      <div className="md:hidden h-28"></div>
    </div>
  );
}
