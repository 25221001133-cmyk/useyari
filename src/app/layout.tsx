import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { ThemeProvider } from "@/lib/theme";
import { TradingProvider } from "@/lib/trading";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "UseYari — Your Investing Yaari",
  description: "India's AI-powered investing ecosystem. Trade, learn & grow together on NSE/BSE with real-time insights, portfolio analytics, and a thriving community.",
  keywords: ["UseYari", "Indian stock market", "investing app", "NSE BSE", "AI investing", "paper trading", "stock simulator"],
  openGraph: {
    title: "UseYari — Your Investing Yaari",
    description: "AI-powered Indian investing ecosystem. Trade, learn & grow together.",
    siteName: "UseYari",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UseYari — Your Investing Yaari",
    description: "AI-powered Indian investing ecosystem. Trade, learn & grow together.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#387ED1" />
      </head>
      <body className="h-full">
        <ThemeProvider>
          <TradingProvider>
            <AppShell>{children}</AppShell>
          </TradingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
