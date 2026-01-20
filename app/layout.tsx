import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import WebsiteOnly from "@/components/WebsiteOnly";
import { ClerkProvider } from '@clerk/nextjs';
// ✅ 1. Import CartProvider
import { CartProvider } from "@/context/CartContext";

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
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} min-h-screen flex flex-col`}>
          {/* ✅ 2. Wrap the content inside CartProvider so Navigation & Pages can access cart state */}
          <CartProvider>
            
            <WebsiteOnly>
              <Navigation />
            </WebsiteOnly>

            <main className="flex-grow">
              {children}
            </main>

            <WebsiteOnly>
              <Footer />
            </WebsiteOnly>

          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}