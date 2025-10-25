import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { IsYourDayOkNFTABI } from "~/lib/abis/IsYourDayOkNFT";
import { prisma } from "~/lib/prisma";

const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`;

// Achievement type enum mapping
const ACHIEVEMENT_TYPE_MAP = {
  "journal-7": 0,
  "journal-30": 1,
  "meditation-7": 2,
  "meditation-30": 3,
} as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { achievementId, userAddress, achievementType, improvementRating } =
      body;

    // Validate inputs
    if (
      !achievementId ||
      !userAddress ||
      !achievementType ||
      improvementRating === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (improvementRating < 1 || improvementRating > 100) {
      return NextResponse.json(
        { error: "Improvement rating must be between 1 and 100" },
        { status: 400 }
      );
    }

    // Check if admin private key is configured
    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
    if (!adminPrivateKey) {
      console.error(
        "ADMIN_PRIVATE_KEY not configured in environment variables"
      );
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Map achievement type to contract enum
    const achievementTypeEnum =
      ACHIEVEMENT_TYPE_MAP[
        achievementType as keyof typeof ACHIEVEMENT_TYPE_MAP
      ];
    if (achievementTypeEnum === undefined) {
      return NextResponse.json(
        { error: "Invalid achievement type" },
        { status: 400 }
      );
    }

    // Create wallet client with admin account
    const account = privateKeyToAccount(adminPrivateKey as `0x${string}`);
    const walletClient = createWalletClient({
      account,
      chain: base,
      transport: http(process.env.RPC_URL || "https://mainnet.base.org"),
    }).extend(publicActions);

    // Check if user has already minted this achievement type
    const hasMinted = await walletClient.readContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: IsYourDayOkNFTABI,
      functionName: "hasUserMinted",
      args: [userAddress as `0x${string}`, achievementTypeEnum],
    });

    if (hasMinted) {
      return NextResponse.json(
        { error: "User has already minted this achievement type" },
        { status: 400 }
      );
    }

    // Generate metadata URI for the NFT
    // Using your website for metadata (faster and updatable)
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://isyourdayok.com";
    const metadataURIs = {
      "journal-7": `${baseUrl}/nft-metadata/journal-7.json`,
      "journal-30": `${baseUrl}/nft-metadata/journal-30.json`,
      "meditation-7": `${baseUrl}/nft-metadata/meditation-7.json`,
      "meditation-30": `${baseUrl}/nft-metadata/meditation-30.json`,
    };

    const metadataUri =
      metadataURIs[achievementType as keyof typeof metadataURIs];

    if (!metadataUri) {
      return NextResponse.json(
        { error: "Invalid achievement type for metadata" },
        { status: 400 }
      );
    }

    // Mint the NFT
    console.log("Minting NFT for:", userAddress);
    console.log(
      "Achievement type:",
      achievementType,
      "(enum:",
      achievementTypeEnum,
      ")"
    );
    console.log("Improvement rating:", improvementRating);
    console.log("Metadata URI:", metadataUri);

    const hash = await walletClient.writeContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: IsYourDayOkNFTABI,
      functionName: "mintAchievement",
      args: [
        userAddress as `0x${string}`,
        achievementTypeEnum,
        BigInt(improvementRating),
        metadataUri,
      ],
    });

    console.log("Transaction hash:", hash);

    // Wait for transaction receipt
    const receipt = await walletClient.waitForTransactionReceipt({ hash });
    console.log("Transaction confirmed:", receipt.status);

    if (receipt.status !== "success") {
      throw new Error("Transaction failed");
    }

    // Extract tokenId from the AchievementMinted event
    let tokenId = "0";
    if (receipt.logs && receipt.logs.length > 0) {
      // The AchievementMinted event should be in the logs
      const achievementMintedLog = receipt.logs.find(
        (log) =>
          log.address.toLowerCase() === NFT_CONTRACT_ADDRESS.toLowerCase()
      );
      if (achievementMintedLog && achievementMintedLog.topics[1]) {
        tokenId = BigInt(achievementMintedLog.topics[1]).toString();
      }
    }

    // Update achievement in database
    await prisma.nFTAchievement.update({
      where: { id: achievementId },
      data: {
        minted: true,
        mintedAt: new Date(),
        tokenId,
        contractAddress: NFT_CONTRACT_ADDRESS,
        transactionHash: hash,
      },
    });

    return NextResponse.json({
      success: true,
      tokenId,
      transactionHash: hash,
      contractAddress: NFT_CONTRACT_ADDRESS,
    });
  } catch (error: any) {
    console.error("Error minting NFT:", error);
    return NextResponse.json(
      { error: error.message || "Failed to mint NFT" },
      { status: 500 }
    );
  }
}
