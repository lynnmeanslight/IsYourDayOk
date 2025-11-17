import { METADATA } from "../../../lib/utils";

export async function GET() {
  const config = {
    accountAssociation: {
      
    },
    frame: {
      version: "1",
      name: METADATA.name,
      iconUrl: METADATA.iconImageUrl,
      homeUrl: METADATA.homeUrl,
      imageUrl: METADATA.bannerImageUrl,
      splashImageUrl: METADATA.iconImageUrl,
      splashBackgroundColor: METADATA.splashBackgroundColor,
      description: METADATA.description,
      ogTitle: METADATA.name,
      ogDescription: METADATA.ogDescription,
      ogImageUrl: METADATA.bannerImageUrl,
      primaryCategory: "health-fitness",
      requiredCapabilities: [
        "actions.ready",
        "actions.signIn",
        "actions.openMiniApp",
        "actions.openUrl",
        "actions.sendToken",
        "actions.viewToken",
        "actions.composeCast",
        "actions.viewProfile",
        "actions.setPrimaryButton",
        "actions.swapToken",
        "actions.close",
        "actions.viewCast",
        "wallet.getEthereumProvider",
      ],
      requiredChains: ["eip155:8453", "eip155:8453", "eip155:10"],
      canonicalDomain: "is-your-day-ok.vercel.app",
      noindex: false,
      tags: ["mental-health", "wellness", "mindfulness", "baseapp", "miniapp"],
    },
    miniapp: {
      version: "1",
      name: METADATA.name,
      iconUrl: METADATA.iconImageUrl,
      homeUrl: METADATA.homeUrl,
      imageUrl: METADATA.bannerImageUrl,
      splashImageUrl: METADATA.iconImageUrl,
      splashBackgroundColor: METADATA.splashBackgroundColor,
      description: METADATA.description,
      ogTitle: METADATA.name,
      ogDescription: METADATA.ogDescription,
      ogImageUrl: METADATA.bannerImageUrl,
      primaryCategory: "health-fitness",
      requiredCapabilities: [
        "actions.ready",
        "actions.signIn",
        "actions.openMiniApp",
        "actions.openUrl",
        "actions.sendToken",
        "actions.viewToken",
        "actions.composeCast",
        "actions.viewProfile",
        "actions.setPrimaryButton",
        "actions.swapToken",
        "actions.close",
        "actions.viewCast",
        "wallet.getEthereumProvider",
      ],
      requiredChains: ["eip155:8453", "eip155:8453", "eip155:10"],
      canonicalDomain: "is-your-day-ok.vercel.app",
      noindex: false,
      tags: ["mental-health", "wellness", "mindfulness", "baseapp", "miniapp"],
    },
    baseBuilder: {
      ownerAddress: "0x13aa8Ccb6d6ffC659446fF0737C668dB581F4C34",
      allowedAddresses: [
        "0x76967Ce1457D65703445FbE024Dd487A151ad993",
        "0x13aa8Ccb6d6ffC659446fF0737C668dB581F4C34",
      ],
    },
  };

  return Response.json(config);
}
