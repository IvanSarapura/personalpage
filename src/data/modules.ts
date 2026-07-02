export interface Module {
  num: string;
  name: string;
  description: string;
}

export const MODULES: Module[] = [
  {
    num: "01",
    name: "Review Aggregation",
    description:
      "Consolidates reviews from Google, Yelp, TripAdvisor and 20+ platforms into a single unified dashboard. Every mention of your brand is captured in real time, filtered by sentiment and topic so your team never misses a signal.",
  },
  {
    num: "02",
    name: "AI Insights",
    description:
      "Natural language processing detects sentiment patterns, emerging issues and revenue risks before they escalate. Our models learn from your historical data to surface the trends that actually impact guest satisfaction and repeat visits.",
  },
  {
    num: "03",
    name: "Presence Management",
    description:
      "Ensures consistent NAP data and brand messaging across all directories and social platforms. When information changes at headquarters, every location listing updates automatically so guests always find the right address, hours and menu.",
  },
  {
    num: "04",
    name: "Incident Management",
    description:
      "Real-time alerts and automated workflows to resolve customer complaints before they become public. Each incident is routed to the right team member with context, priority and suggested next steps based on severity and guest history.",
  },
  {
    num: "05",
    name: "Location Objective",
    description:
      "Set and track per-location CX targets with automated reporting and accountability dashboards. Managers receive weekly scorecards aligned to revenue goals, while leadership sees portfolio-wide trends and outliers at a glance.",
  },
  {
    num: "06",
    name: "Performance Analytics",
    description:
      "Benchmark every branch against regional and industry standards with actionable scorecards. Compare response times, satisfaction trends and resolution rates across locations to identify top performers and underperformers instantly.",
  },
  {
    num: "07",
    name: "Customer Retention",
    description:
      "Identify at-risk guests and trigger personalized win-back campaigns based on behavioral signals. From declining visit frequency to negative sentiment shifts, the system flags churn risk early and recommends the right outreach to recover loyalty.",
  },
];
