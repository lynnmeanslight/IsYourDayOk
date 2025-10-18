import { METADATA } from "../../../lib/utils";

export async function GET() {
  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjg3NzAwMSwidHlwZSI6ImF1dGgiLCJrZXkiOiIweEJDN2EzRTVEZDFFOWY3MjU4MDY1YzU1Y0EzNjNlNjJiZTRFNTYxYjAifQ",
      payload:
        "eyJkb21haW4iOiJyZWFyLXZhbC1mb3J0eS1zb2NjZXIudHJ5Y2xvdWRmbGFyZS5jb20ifQ",
      signature:
        "wgeqLbHClrOLhYESa3uydL4XB5PxkSwxdU/dKko0V0pKlbeZFR7OjqA8SN+MYSqZhY0G30/LqnATVUVEiwKScBw=",
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
      requiredChains: ["eip155:8453", "eip155:10"],
      canonicalDomain: "frames-v2-demo-lilac.vercel.app",
      noindex: false,
      tags: ["base", "baseapp", "miniapp", "demo", "basepay"],
    },
    baseBuilder: {
      allowedAddresses: ["0x8342A48694A74044116F330db5050a267b28dD85"],
    },
  };

  return Response.json(config);
}
