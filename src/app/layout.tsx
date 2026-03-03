import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/providers/SmoothScroll";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "ImmersiveSpace | 360 Virtual Tours for Real Estate",
    template: "%s | ImmersiveSpace",
  },
  description:
    "Professional 360 virtual tour services for property developers and real estate agents. Capture, process, and deliver stunning immersive property experiences.",
  keywords: [
    "360 virtual tour",
    "property virtual tour",
    "real estate photography",
    "Matterport",
    "virtual tour service",
    "360 photography",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <SmoothScroll>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
