import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import ThemeProvider from "@/providers/ThemeProvider";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { getSiteCopy, SITE } from "@/data/site";
import { buildPersonJsonLd, serializeJsonLd } from "@/data/structured-data";
import { getUi } from "@/data/ui";
import { hasLocale, localePath, LOCALES } from "@/data/locale";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const copy = getSiteCopy(lang);
  const pageTitle = `${SITE.shortName} - Law & Code`;

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: pageTitle,
      template: `%s · ${SITE.shortName}`,
    },
    description: copy.description,
    keywords: [
      "Iván Sarapura",
      "web developer",
      "legal engineering",
      "RegTech",
      "smart contracts",
      "blockchain",
      "AI compliance",
    ],
    alternates: {
      canonical: localePath(lang, "/"),
      languages: {
        en: "/",
        es: "/es",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      url: localePath(lang, "/"),
      siteName: SITE.shortName,
      title: pageTitle,
      description: copy.description,
      locale: lang === "es" ? "es_AR" : "en_US",
    },
    twitter: {
      card: "summary",
      title: pageTitle,
      description: copy.description,
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const ui = getUi(lang);

  return (
    <html lang={lang} className={inter.variable} suppressHydrationWarning>
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
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildPersonJsonLd(lang)) }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          {ui.skipLink}
        </a>
        <ThemeProvider>
          <Navbar locale={lang} />
          {children}
          <Footer locale={lang} />
        </ThemeProvider>
      </body>
    </html>
  );
}
