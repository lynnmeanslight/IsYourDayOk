import { METADATA } from "../../../lib/utils";

export async function GET() {
  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjg3NzAwMSwidHlwZSI6ImF1dGgiLCJrZXkiOiIweEJDN2EzRTVEZDFFOWY3MjU4MDY1YzU1Y0EzNjNlNjJiZTRFNTYxYjAifQ",
      payload: "eyJkb21haW4iOiJpcy15b3VyLWRheS1vay52ZXJjZWwuYXBwIn0",
      signature:
        "1g+j/kUVdOwJTuyVM5S2gX8EWzMjTHnbRRCMNiXhU6Qz3AWy85H7UrIBcA4FZ5m+YGkI1zzMMYPQa5jPPmbssRs=",
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
      ogDescription: METADATA.description,
      ogImageUrl: METADATA.bannerImageUrl,
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
      tags: [
        "mental-health",
        "wellness",
        "mindfulness",
        "meditation",
        "journaling",
        "mood-tracker",
        "nft",
        "achievements",
        "base",
        "baseapp",
        "miniapp",
      ],
    },
    baseBuilder: {
      allowedAddresses: [
        "0x76967Ce1457D65703445FbE024Dd487A151ad993",
        "0x13aa8Ccb6d6ffC659446fF0737C668dB581F4C34",
      ],
    },
  };

  return Response.json(config);
}
