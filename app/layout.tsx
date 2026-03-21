import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "../components/layout/SmoothScroll";
import WebGLPortal from "../components/layout/WebGLPortal";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LuxeNest Realty — Find Where Life Begins",
  description: "Walk through every home from your phone. AI-matched listings. One-click booking. Real estate, reimagined.",
  openGraph: {
    title: "LuxeNest Realty — Find Where Life Begins",
    description: "Walk through every home from your phone. AI-matched listings. One-click booking. Real estate, reimagined.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorantGaramond.variable} ${dmSans.variable} font-sans antialiased bg-bg text-text selection:bg-gold selection:text-bg-deep grain`}>
        <WebGLPortal />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
