import { useEffect, useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

const TARGET_CHAIN_ID = baseSepolia.id; // 84532

export function useAutoSwitchChain() {
  const { chain, isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchError, setSwitchError] = useState<string | null>(null);

  useEffect(() => {
    async function switchToBaseSepolia() {
      // Only attempt to switch if:
      // 1. User is connected
      // 2. Not already on Base Sepolia
      // 3. Not currently switching
      if (isConnected && chain && chain.id !== TARGET_CHAIN_ID && !isSwitching) {
        setIsSwitching(true);
        setSwitchError(null);

        try {
          console.log(`Switching from chain ${chain.id} to Base Sepolia (${TARGET_CHAIN_ID})...`);
          await switchChainAsync({ chainId: TARGET_CHAIN_ID });
          console.log('Successfully switched to Base Sepolia');
        } catch (error: any) {
          console.error('Failed to switch chain:', error);
          setSwitchError(error.message || 'Failed to switch to Base Sepolia');
        } finally {
          setIsSwitching(false);
        }
      }
    }

    switchToBaseSepolia();
  }, [chain, isConnected, switchChainAsync, isSwitching]);

  return {
    isCorrectChain: chain?.id === TARGET_CHAIN_ID,
    isSwitching,
    switchError,
    targetChainId: TARGET_CHAIN_ID,
    currentChainId: chain?.id,
  };
}
