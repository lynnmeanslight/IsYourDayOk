// "use client";

// import { useState } from "react";
// import { useAccount, useSwitchChain } from "wagmi";
// import { base } from "wagmi/chains";

// interface MoodLogProps {
//   contracts: any;
// }

// const moods = [
//   { emoji: "/emojis/happy.png", label: "Happy", value: "happy" },
//   { emoji: "/emojis/calm.png", label: "Calm", value: "calm" },
//   { emoji: "/emojis/neutral.png", label: "Neutral", value: "neutral" },
//   { emoji: "/emojis/down.png", label: "Not Great", value: "not-great" },
//   { emoji: "/emojis/sad.png", label: "Sad", value: "sad" },
// ];

// export function MoodLog({ contracts }: MoodLogProps) {
//   const [selectedMood, setSelectedMood] = useState("");
//   const [rating, setRating] = useState(5);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");
//   const { chain } = useAccount();
//   const { switchChainAsync } = useSwitchChain();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!selectedMood) {
//       setError("Please select a mood");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setSuccess(false);

//     try {
//       // Check if on correct chain, switch if needed
//       if (chain?.id !== base.id) {
//         setError("Switching to Base...");
//         await switchChainAsync({ chainId: base.id });
//         setError("");
//       }

//       await contracts.logMood(selectedMood, rating);
//       setSuccess(true);
//       setSelectedMood("");
//       setRating(5);

//       setTimeout(() => setSuccess(false), 3000);
//     } catch (err: any) {
//       if (err.message?.includes("chain")) {
//         setError("Please switch to Base network in your wallet");
//       } else {
//         setError(err.message || "Failed to log mood");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto px-4 sm:px-6">
//       <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
//         {/* Header - Mobile optimized */}
//         <div className="text-center mb-5 sm:mb-6">
//           <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
//             How are you feeling?
//           </h2>
//           <p className="text-xs sm:text-sm text-gray-500">
//             Earn <span className="font-semibold text-blue-600">10 points</span>{" "}
//             for each mood log
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
//           {/* Mood Selection - Mobile optimized grid */}
//           <div>
//             <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
//               {moods.map((mood) => (
//                 <button
//                   key={mood.value}
//                   type="button"
//                   onClick={() => setSelectedMood(mood.value)}
//                   className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl sm:rounded-2xl transition-all touch-manipulation min-h-[80px] sm:min-h-[90px] ${
//                     selectedMood === mood.value
//                       ? "ring-2 ring-blue-500 bg-blue-50 scale-105"
//                       : "hover:bg-gray-50 active:bg-gray-100 active:scale-95"
//                   }`}
//                 >
//                   <div className="w-10 h-10 sm:w-12 sm:h-12 mb-1 sm:mb-1.5 flex items-center justify-center">
//                     <img
//                       src={mood.emoji}
//                       alt={mood.label}
//                       className="w-full h-full object-contain"
//                     />
//                   </div>
//                   <span className="text-[9px] sm:text-[10px] text-gray-700 font-medium text-center leading-tight px-0.5">
//                     {mood.label}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Rating Slider - Mobile optimized */}
//           <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-5">
//             <label className="block text-xs sm:text-sm font-semibold mb-3 text-gray-700">
//               Rate intensity
//             </label>
//             <div className="space-y-3">
//               <input
//                 type="range"
//                 min="1"
//                 max="10"
//                 value={rating}
//                 onChange={(e) => setRating(Number(e.target.value))}
//                 className="w-full h-2.5 sm:h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 touch-manipulation"
//                 style={{ WebkitAppearance: 'none' }}
//               />
//               <div className="text-center">
//                 <div className="inline-flex items-center gap-1 bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-full">
//                   <span className="text-lg sm:text-xl font-bold">{rating}</span>
//                   <span className="text-xs">/10</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Error Message - Mobile optimized */}
//           {error && (
//             <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl">
//               <p className="text-xs sm:text-sm text-red-600 text-center leading-relaxed">
//                 {error}
//               </p>
//             </div>
//           )}

//           {/* Success Message - Mobile optimized */}
//           {success && (
//             <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl sm:rounded-2xl">
//               <p className="text-xs sm:text-sm text-blue-600 font-medium text-center leading-relaxed">
//                 ✓ Mood logged successfully! +10 points
//               </p>
//             </div>
//           )}

//           {/* Submit Button - Mobile optimized with larger touch target */}
//           <button
//             type="submit"
//             disabled={loading || !selectedMood}
//             className="w-full bg-blue-600 text-white rounded-xl sm:rounded-2xl px-6 py-4 sm:py-4.5 font-semibold text-base sm:text-lg hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg touch-manipulation min-h-[52px]"
//           >
//             {loading ? (
//               <span className="flex items-center justify-center gap-2">
//                 <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 <span>Logging...</span>
//               </span>
//             ) : (
//               "Log Mood"
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { base } from "wagmi/chains";

interface MoodLogProps {
  contracts: any;
}

const moods = [
  { emoji: "/emojis/happy.png", label: "Happy", value: "happy" },
  { emoji: "/emojis/calm.png", label: "Calm", value: "calm" },
  { emoji: "/emojis/neutral.png", label: "Neutral", value: "neutral" },
  { emoji: "/emojis/down.png", label: "Not Great", value: "not-great" },
  { emoji: "/emojis/sad.png", label: "Sad", value: "sad" },
];

export function MoodLog({ contracts }: MoodLogProps) {
  const [selectedMood, setSelectedMood] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMood) {
      setError("Please select a mood");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Check if on correct chain, switch if needed
      if (chain?.id !== base.id) {
        setError("Switching to Base...");
        await switchChainAsync({ chainId: base.id });
        setError("");
      }

      await contracts.logMood(selectedMood, rating);
      setSuccess(true);
      setSelectedMood("");
      setRating(5);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      if (err.message?.includes("chain")) {
        setError("Please switch to Base network in your wallet");
      } else {
        setError(err.message || "Failed to log mood");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">How are you feeling?</h2>
          <p className="text-sm text-gray-500">
            Earn <span className="font-semibold text-blue-600">10 points</span>{" "}
            for each mood log
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood Selection */}
          <div>
            <div className="grid grid-cols-5 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood.value)}
                  className={`flex flex-col items-center justify-center p-1 rounded-2xl transition-all ${
                    selectedMood === mood.value
                      ? "ring-2 ring-blue-500 scale-105"
                      : "hover:bg-gray-100 active:scale-95"
                  }`}
                >
                  <div className="w-12 h-12 mb-1.5 flex items-center justify-center">
                    <img
                      src={mood.emoji}
                      alt={mood.label}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[10px] text-gray-700 font-medium text-center leading-tight">
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Rating Slider */}
          <div className="bg-gray-50 rounded-2xl p-5">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              Rate intensity
            </label>
            <div className="space-y-3">
              <input
                type="range"
                min="1"
                max="10"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="text-center">
                <div className="inline-flex items-center gap-1 bg-blue-600 text-white px-5 py-2 rounded-full">
                  <span className="text-xl font-bold">{rating}</span>
                  <span className="text-xs">/10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-center">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <p className="text-xs text-blue-600 font-medium">
                ✓ Mood logged successfully! +10 points
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !selectedMood}
            className="w-full bg-blue-600 text-white rounded-2xl px-6 py-3.5 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? "Logging..." : "Log Mood"}
          </button>
        </form>
      </div>
    </div>
  );
}