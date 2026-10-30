// One place for site-wide settings.
// SITE_URL: your live address. Change it here if you move to a custom domain (e.g. https://aquibisrar.com).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://aquib-ranks.vercel.app");

// Microsoft Clarity project ID. Either paste it between the quotes below,
// or (easier) add NEXT_PUBLIC_CLARITY_ID in Vercel → Settings → Environment Variables, then redeploy.
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "z5qszto4qw";
