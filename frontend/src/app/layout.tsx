import type { Metadata } from "next";


import "~/app/globals.css";
import { Providers } from "~/app/providers";
import { METADATA } from "~/lib/utils";

export const metadata: Metadata = {
  title: METADATA.name,
  description: METADATA.description,
  keywords: ['mental health', 'wellbeing', 'blockchain', 'Base', 'NFT', 'meditation', 'journaling', 'mood tracker', 'self-care', 'mental wellness'],
  authors: [{ name: 'IsYourDayOk Team' }],
  creator: 'IsYourDayOk',
  publisher: 'IsYourDayOk',
  icons: {
    icon: '/icons/IsYourDayOkfinal.png',
    apple: '/icons/IsYourDayOkfinal.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: METADATA.name,
    description: METADATA.description,
    images: [
      {
        url: METADATA.bannerImageUrl,
        width: 1200,
        height: 630,
        alt: 'IsYourDayOk - Mental Health Tracker',
      }
    ],
    url: METADATA.homeUrl,
    siteName: METADATA.name
  },
  twitter: {
    card: 'summary_large_image',
    title: METADATA.name,
    description: METADATA.description,
    images: [METADATA.bannerImageUrl],
    creator: '@IsYourDayOk',
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
