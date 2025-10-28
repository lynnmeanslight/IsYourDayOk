import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const METADATA = {
  name: "IsYourDayOk",
  tagline: "Check in. Reflect. Grow. Own Your Wellness Journey.",
  subtitle: "Your Daily Mental Wellness Companion on Base",
  description:
    "Track your mood, journal, and meditate daily. Earn NFTs for streaks, join a supportive community, and grow your wellness journey on Base.",
  ogDescription:
    "Track mood, journal, meditate, and earn NFTs for streaks. Build your wellness journey on Base.",
  longDescription:
    "IsYourDayOk is a comprehensive mental health tracking platform that helps you build lasting wellness habits through daily check-ins, journaling, and mindfulness practices. Earn points for each activity, unlock achievement NFTs when you hit milestones (7-day and 30-day streaks), and visualize your progress over time. Built on Base blockchain with Farcaster integration, your mental health data stays private while your achievements remain yours forever.",
  marketingTaglines: {
    primary: "Check in. Reflect. Grow. Own Your Wellness Journey.",
    alternative: [
      "Your mental health matters. Track it. Own it. Forever.",
      "Building better days, one check-in at a time.",
      "Mindfulness meets blockchain. Your wellness, your NFTs.",
      "Turn consistency into achievement. Your streaks, your rewards.",
      "Mental wellness that rewards you—on chain, for life.",
      "Daily habits. Lifetime achievements. All yours on Base.",
      "From mood tracking to milestone NFTs—wellness redefined.",
    ],
  },
  features: [
    "Daily mood tracking with visual analytics",
    "Private journaling with streak rewards",
    "Guided meditation sessions",
    "Achievement NFTs for consistency milestones",
    "Points-based gamification system",
    "Community support through chat",
    "Farcaster integration for social wellness",
  ],
  bannerImageUrl: `${
    process.env.NEXT_PUBLIC_URL ?? "https://is-your-day-ok.vercel.app"
  }/icons/og_image.png`,
  iconImageUrl: `${
    process.env.NEXT_PUBLIC_URL ?? "https://is-your-day-ok.vercel.app"
  }/icons/IsYourDayOkfinal.png`,
  homeUrl: process.env.NEXT_PUBLIC_URL ?? "https://is-your-day-ok.vercel.app",
  splashBackgroundColor: "#2563EB",
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
