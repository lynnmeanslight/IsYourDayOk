import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const METADATA = {
  name: "IsYourDayOk - Mental Health Tracker on Base",
  description: "Track your mental health journey with daily mood logs, journaling, guided meditation, and earn achievement NFTs on Base blockchain. Join our supportive community and improve your wellbeing.",
  bannerImageUrl: `${process.env.NEXT_PUBLIC_URL ?? "https://is-your-day-ok.vercel.app"}/icons/image.PNG`,
  iconImageUrl: `${process.env.NEXT_PUBLIC_URL ?? "https://is-your-day-ok.vercel.app"}/icons/IsYourDayOkfinal.png`,
  homeUrl: process.env.NEXT_PUBLIC_URL ?? "https://is-your-day-ok.vercel.app",
  splashBackgroundColor: "#2563EB"
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}