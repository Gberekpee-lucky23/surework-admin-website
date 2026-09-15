/**
 * Application download links configured via environment variables with fallback defaults.
 *
 * Environment variables:
 * - NEXT_PUBLIC_PLAYSTORE_URL (or NEXT_PUBLIC_GOOGLE_PLAY_URL)
 * - NEXT_PUBLIC_APK_URL (or NEXT_PUBLIC_APK_DOWNLOAD_URL)
 */

export const APP_LINKS = {
  playStore:
    process.env.NEXT_PUBLIC_PLAYSTORE_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL ||
    "https://play.google.com/store",
  apk:
    process.env.NEXT_PUBLIC_APK_URL ||
    process.env.NEXT_PUBLIC_APK_DOWNLOAD_URL ||
    "https://github.com/Gberekpee-lucky23/surework-admin-website/releases/download/v1.0.0/Surework.v1.0.0.apk",
} as const;
