# ⚡ Deployment Quick Start - IsYourDayOk

**Last Updated**: October 25, 2025

> **Quick reference for deployment blockers. See `FINAL_DEPLOYMENT_CHECKLIST.md` for complete guide.**

---

## 🚨 CRITICAL BLOCKERS (Fix These First!)

### 1. Add Environment Variables

**File**: `/frontend/.env.local`

**Add these lines**:
```bash
# CRITICAL - Add your admin wallet's private key
ADMIN_PRIVATE_KEY="0x..."

# CRITICAL - Add your production domain
NEXT_PUBLIC_APP_URL="https://your-actual-domain.com"

# UPDATE - Change localhost to production
NEXT_PUBLIC_URL="https://your-actual-domain.com"

# OPTIONAL - For mobile wallet support
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your-walletconnect-project-id"
```

**Where to get ADMIN_PRIVATE_KEY**:
- Open wallet that deployed contract `0xbe12BEE2433AA6bE6e4f558DA9bCd44F6DD7B981`
- Export private key from wallet settings
- **NEVER commit this to git!**

---

### 2. Add NFT Image

**Path**: `/frontend/public/nft/achievement.png`

**Specs**:
- Size: 500×500px or 1000×1000px
- Format: PNG
- Style: Trophy/medal/badge design
- Colors: Blue/white theme

**Quick check**:
```bash
ls /Users/lynn/Desktop/IsYourDayOk/frontend/public/nft/achievement.png
```

---

### 3. Update Metadata Files

**Files**: `/frontend/public/nft-metadata/*.json` (all 4 files)

**Quick fix**:
```bash
cd /Users/lynn/Desktop/IsYourDayOk/frontend/public/nft-metadata

# Replace placeholder domain in all files
sed -i '' 's/your-domain.com/your-actual-domain.com/g' *.json

# Verify
grep "image" journal-7.json
# Should show: "image": "https://your-actual-domain.com/nft/achievement.png"
```

---

### 4. Fund Admin Wallet

**Required**: >0.05 Sepolia ETH for gas fees

**Check balance**:
```
https://sepolia.basescan.org/address/[YOUR_ADMIN_WALLET_ADDRESS]
```

**Get testnet ETH**:
```
https://faucet.quicknode.com/base/sepolia
```

---

## ✅ Quick Test Before Deploy

```bash
cd /Users/lynn/Desktop/IsYourDayOk/frontend

# 1. Check environment
cat .env.local | grep ADMIN_PRIVATE_KEY  # Should NOT be empty
cat .env.local | grep NEXT_PUBLIC_APP_URL  # Should NOT be empty

# 2. Check files
ls public/nft/achievement.png  # Should exist
grep "your-domain.com" public/nft-metadata/*.json  # Should return NOTHING

# 3. Start dev server
npm run dev

# 4. Test in browser
# - Connect wallet
# - Log a mood
# - Write 7 journals to unlock achievement
# - Try minting NFT
# - Wait 30-60 seconds
# - Check for success message
# - Verify NFT in wallet

# 5. Build for production
npm run build  # Should complete without errors
```

---

## 🚀 Deploy Command

**For Vercel**:
```bash
vercel --prod
```

**For other platforms**:
- Follow platform-specific deployment guide
- Ensure environment variables configured in platform dashboard
- Ensure database accessible from deployment environment

---

## 🆘 If Something Breaks

**"Server configuration error"**:
- Missing `ADMIN_PRIVATE_KEY` → Add to `.env.local` and restart

**NFT image not showing**:
- Missing `achievement.png` → Add to `/public/nft/`
- Wrong metadata URL → Update JSON files

**Transaction fails**:
- Admin wallet out of ETH → Get more from faucet
- Wrong private key → Verify contract owner matches

**Can't mint achievement**:
- Not unlocked yet → Complete required streak (7 or 30 days)
- Already minted → Each type can only be minted once

---

## 📋 Post-Deployment Checklist

After deploying, verify:

- [ ] App loads at production URL
- [ ] Wallet connection works
- [ ] Metadata accessible: `https://your-domain.com/nft-metadata/journal-7.json`
- [ ] Image accessible: `https://your-domain.com/nft/achievement.png`
- [ ] One complete mint test successful
- [ ] NFT visible in wallet (OpenSea testnet or BaseScan)

---

## 📚 Full Documentation

For complete testing protocols, troubleshooting, and security checklist:
- **Primary Guide**: `FINAL_DEPLOYMENT_CHECKLIST.md`
- **Original Checklist**: `PRE_DEPLOYMENT_CHECKLIST.md`
- **NFT Setup**: `NFT_MINTING_SETUP.md`

---

**Status**: 🔴 NOT READY - Complete 4 critical blockers above  
**Ready to Deploy**: ⬜ YES / ⬜ NO
