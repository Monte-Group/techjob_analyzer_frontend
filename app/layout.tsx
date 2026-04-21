import type { Metadata, Viewport } from "next";
import { Playfair_Display, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_URL = "https://stack.kz";
const SITE_TITLE = "Stack.kz — Аналитика IT-рынка Казахстана: зарплаты, скиллы, тренды";
const SITE_DESC =
  "Реальные данные из HH.ru и LinkedIn. Узнай какие скиллы в тренде в Казахстане, сколько платят по твоему стеку, и как меняется спрос. Обновляется каждые 4 часа.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · Stack.kz",
  },
  description: SITE_DESC,
  applicationName: "Stack.kz",
  authors: [{ name: "Stack.kz" }],
  generator: "Next.js",
  keywords: [
    "IT зарплаты Казахстан",
    "зарплаты программистов Алматы",
    "IT вакансии Астана",
    "аналитика рынка труда IT",
    "HH.ru аналитика",
    "скиллы в тренде 2026",
    "сколько платят разработчикам",
    "средняя зарплата React Kazakhstan",
    "salary analytics Kazakhstan",
    "tech job market",
    "востребованные языки программирования",
    "DevOps зарплата",
    "Python Go React вакансии",
  ],
  category: "technology",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      "ru-KZ": "/",
      "kk-KZ": "/kk",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_KZ",
    alternateLocale: ["kk_KZ", "en_US"],
    url: SITE_URL,
    siteName: "Stack.kz",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Stack.kz — Аналитика IT-рынка Казахстана",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ["/og.png"],
    creator: "@stack_kz",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
  verification: {
    google: "google-site-verification-placeholder",
    yandex: "yandex-verification-placeholder",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
    { media: "(prefers-color-scheme: light)", color: "#0a0a0b" },
  ],
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Stack.kz",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  description: SITE_DESC,
  foundingDate: "2025",
  areaServed: { "@type": "Country", name: "Kazakhstan" },
  sameAs: ["https://t.me/stack_kz", "https://github.com/stack-kz"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: SITE_URL,
  name: "Stack.kz",
  inLanguage: "ru-KZ",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?q={query}`,
    "query-input": "required name=query",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Stack.kz — Tech Job Market Analyzer",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "KZT",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "4900",
      priceCurrency: "KZT",
    },
    {
      "@type": "Offer",
      name: "Team",
      price: "19900",
      priceCurrency: "KZT",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "312",
    bestRating: "5",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${playfair.variable} ${plexSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
