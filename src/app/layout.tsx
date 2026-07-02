import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";
import { env } from "@/env";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const siteUrl = env.NEXT_PUBLIC_SITE_URL;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Sira",
  applicationCategory: "BusinessApplication",
  description:
    "Sira doesn't just show what's wrong, it fixes it. 7 modules in 1 platform driving revenue.",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  url: siteUrl,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sira — AI-Powered Customer Intelligence",
    template: "%s | Sira",
  },
  description:
    "Sira doesn't just show what's wrong, it fixes it. 7 modules in 1 platform driving revenue for restaurants.",
  keywords: [
    "restaurant intelligence",
    "AI customer experience",
    "review management",
    "restaurant analytics",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Sira",
    title: "Sira — AI-Powered Customer Intelligence",
    description:
      "Sira doesn't just show what's wrong, it fixes it. 7 modules in 1 platform driving revenue for restaurants.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Sira — AI Customer Intelligence for restaurants",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sira — AI-Powered Customer Intelligence",
    description:
      "Sira doesn't just show what's wrong, it fixes it. 7 modules in 1 platform driving revenue for restaurants.",
    images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=630&fit=crop"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  const theme = localStorage.getItem("theme");
                  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  const isDark = theme === "dark" || (!theme && systemDark);
                  if (isDark) {
                    document.documentElement.classList.add("dark");
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
