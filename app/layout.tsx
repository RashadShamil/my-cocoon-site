// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Connects your pink styles
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
      <body className={inter.className}>
        <WebsiteOnly>
          <Navigation /> 
        </WebsiteOnly>
        <main className="min-h-screen bg-background">
          {children}
        </main>
        <WebsiteOnly>
          <Footer />
        </WebsiteOnly> 
      </body>
    </html>
  );
}