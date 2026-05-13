import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { ThemeProvider } from "@/lib/theme";
import { TradingProvider } from "@/lib/trading";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "StockSim India — Premium Market Simulator",
  description: "India's most advanced stock market simulator with real-time NSE/BSE data, AI investment insights, and paper trading.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
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
