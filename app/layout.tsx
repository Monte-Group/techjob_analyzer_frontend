import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IT Job Market — Kazakhstan",
  description: "Анализ IT-рынка труда Казахстана",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
