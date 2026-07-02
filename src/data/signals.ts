export interface Signal {
  id: string;
  title: string;
  description: string;
  meta: string;
}

export const SIGNALS = [
  {
    id: "guest-reviews",
    title: "Guest Reviews",
    description:
      "Aggregate and analyze ratings and written reviews from Google, Yelp, TripAdvisor, and 20+ platforms into a single live feed.",
    meta: "20+ platforms",
  },
  {
    id: "social-sentiment",
    title: "Social Sentiment",
    description:
      "Monitor brand mentions, hashtags, and sentiment shifts across Instagram, Facebook, X, and Reddit in real time.",
    meta: "Real-time",
  },
  {
    id: "direct-feedback",
    title: "Direct Feedback",
    description:
      "Capture post-visit SMS surveys, email responses, and in-venue feedback forms — all routed into one unified inbox.",
    meta: "3 channels",
  },
  {
    id: "location-signals",
    title: "Location Signals",
    description:
      "Track Q&A activity, photo uploads, and search-rank changes across Google Business, Apple Maps, and 500+ local directories.",
    meta: "500+ directories",
  },
  {
    id: "incident-reports",
    title: "Incident Reports",
    description:
      "Log staff escalations, complaint tickets, and operational alerts as structured signals linked to the customer journey.",
    meta: "Ops-linked",
  },
  {
    id: "competitor-intel",
    title: "Competitor Intel",
    description:
      "Benchmark your ratings, sentiment, and menu positioning against nearby competitors to surface market-level opportunity.",
    meta: "Market-wide",
  },
] as const satisfies readonly Signal[];

/** Union de los IDs de señal, derivada de SIGNALS (fuente única de verdad). */
export type SignalId = (typeof SIGNALS)[number]["id"];

export const STATS = [
  { value: "20+", label: "Platforms connected" },
  { value: "Real-time", label: "Signal capture" },
  { value: "7", label: "AI modules" },
  { value: "100%", label: "Journey coverage" },
] as const;
