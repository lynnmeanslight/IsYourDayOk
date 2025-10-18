# Auto Chain Switching to Base Sepolia

This app is configured to automatically switch users to **Base Sepolia (ChainId: 84532)** when they connect their wallet.

## How it works

1. **Auto-detection**: When a user connects their wallet, the app checks if they're on Base Sepolia
2. **Auto-switch**: If they're on a different network, the app automatically prompts them to switch
3. **User feedback**: Clear loading states and error messages guide the user through the process

## Implementation

### Files Modified/Created

1. **`src/lib/useAutoSwitchChain.ts`** (NEW)
   - Custom hook that monitors the connected chain
   - Automatically triggers chain switch if not on Base Sepolia
   - Returns status info for UI feedback

2. **`src/components/MentalHealth.tsx`** (MODIFIED)
   - Imports and uses `useAutoSwitchChain` hook
   - Shows loading screen while switching chains
   - Shows error screen if switch fails

3. **`src/lib/useContracts.ts`** (VERIFIED)
   - Already configured to use Base Sepolia (chainId: 84532)
   - Contract addresses point to Base Sepolia deployments

4. **`src/components/providers/WagmiProvider.tsx`** (VERIFIED)
   - Includes Base Sepolia in supported chains

## Contract Addresses (Base Sepolia)

- **IsYourDayOkPoints**: `0x53D68885D3Bd841B9eD99306eCa07C7f43fDF557`
- **IsYourDayOkNFT**: `0xbe12BEE2433AA6bE6e4f558DA9bCd44F6DD7B981`

## Testing

1. Connect with a wallet on Base Mainnet (8453)
2. The app should automatically prompt to switch to Base Sepolia (84532)
3. Approve the switch in your wallet
4. App should load normally on Base Sepolia

## Switching to Base Mainnet (Future)

To switch to Base Mainnet in the future:

1. Update `useAutoSwitchChain.ts`:
   ```typescript
   import { base } from 'wagmi/chains';
   const TARGET_CHAIN_ID = base.id; // 8453
   ```

2. Update contract addresses in `useContracts.ts` to mainnet addresses

3. Update all contract interactions to use `base` instead of `baseSepolia`
