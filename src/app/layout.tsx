import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adaptive Study Path Engine - Diagnostic quiz-powered learning",
  description:
    "A diagnostic-quiz driven study planner for undergraduate CS students. Take a short quiz, get a personalized study path, and watch it adapt as you practice.",
  keywords: [
    "Adaptive Study Path Engine",
    "CS study tool",
    "Data Structures",
    "Algorithms",
    "diagnostic quiz",
    "personalized learning",
  ],
  authors: [{ name: "Group 11 - Sachin Bhattarai" }],
  openGraph: {
    title: "Adaptive Study Path Engine",
    description: "Diagnostic quiz-powered personalized study paths for CS students.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${jetbrains.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
