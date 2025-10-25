import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const METADATA = {
  name: "IsYourDayOk",
  subtitle: "Your Daily Mental Wellness Companion on Base",
  description: "Track your mental health journey with daily mood logging, reflective journaling, and guided meditation. Earn achievement NFTs for maintaining streaks, connect with a supportive community, and build consistent wellness habits—all on Base blockchain.",
  longDescription: "IsYourDayOk is a comprehensive mental health tracking platform that helps you build lasting wellness habits through daily check-ins, journaling, and mindfulness practices. Earn points for each activity, unlock achievement NFTs when you hit milestones (7-day and 30-day streaks), and visualize your progress over time. Built on Base blockchain with Farcaster integration, your mental health data stays private while your achievements remain yours forever.",
  features: [
    "Daily mood tracking with visual analytics",
    "Private journaling with streak rewards",
    "Guided meditation sessions",
    "Achievement NFTs for consistency milestones",
    "Points-based gamification system",
    "Community support through chat",
    "Farcaster integration for social wellness"
  ],
  bannerImageUrl: `${process.env.NEXT_PUBLIC_URL ?? "https://is-your-day-ok.vercel.app"}/icons/image.PNG`,
  iconImageUrl: `${process.env.NEXT_PUBLIC_URL ?? "https://is-your-day-ok.vercel.app"}/icons/IsYourDayOkfinal.png`,
  homeUrl: process.env.NEXT_PUBLIC_URL ?? "https://is-your-day-ok.vercel.app",
  splashBackgroundColor: "#2563EB"
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}