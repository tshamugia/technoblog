import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechnoBlog - Latest Tech News & Insights",
  description:
    "Stay updated with the latest technology news, tutorials, and insights from industry experts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Header - positioned absolutely over the carousel */}

            <Header />

            {children}
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
