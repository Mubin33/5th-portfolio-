import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "MD. Yasin Arafat Mubin — Creative Developer & Frontend Engineer",
  description:
    "Portfolio of MD. Yasin Arafat Mubin. Frontend-focused full stack engineer specializing in React 19, Next.js 16, TypeScript, GSAP motion, and AI agentic workflows. Based in Dhaka, Bangladesh.",
  keywords: [
    "MD. Yasin Arafat Mubin",
    "Mubin",
    "Frontend Developer",
    "Creative Developer",
    "Next.js Developer",
    "GSAP Animation Specialist",
    "Full Stack Engineer", 
    "Dhaka Bangladesh", 
  ],
  authors: [{ name: "MD. Yasin Arafat Mubin" }],
  creator: "MD. Yasin Arafat Mubin",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mubindev.com",
    title: "MD. Yasin Arafat Mubin — Creative Developer & Frontend Engineer",
    description:
      "Frontend-focused full stack engineer specializing in React 19, Next.js 16, TypeScript, GSAP motion, and AI workflows.",
    siteName: "MD. Yasin Arafat Mubin Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "MD. Yasin Arafat Mubin — Creative Developer",
    description: "Creative developer portfolio built with Next.js, GSAP, and strict Swiss typography.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} bg-black text-white antialiased`}>
      <body className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans relative">
        {children}
      </body>
    </html>
  );
}
