import type { Metadata } from "next";

const TITLE = "Вход и регистрация";
const DESCRIPTION =
  "Войди или создай аккаунт в J — AI: аналитика IT-рынка Казахстана, Telegram-сигналы и AI-чат по выбранному источнику данных.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/login" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/login",
    title: TITLE,
    description: DESCRIPTION,
    siteName: "J — AI",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
