import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import WebsiteOnly from "@/components/WebsiteOnly";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cocoon Kids",
  description: "Fashion for little princesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* ✅ FIX: Ensure body has min-h-screen and NO overflow-hidden */}
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <WebsiteOnly>
          <Navigation />
        </WebsiteOnly>

        {/* ✅ FIX: Ensure main has flex-grow so footer sits at bottom, and NO overflow-hidden */}
        <main className="flex-grow">
          {children}
        </main>

        <WebsiteOnly>
          <Footer />
        </WebsiteOnly>
      </body>
    </html>
  );
}