'use client'
import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { EdgeStoreProvider } from "@/lib/edgestore";

// Custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  // useEffect to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null while the component is not yet mounted
  if (!mounted) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {/* Render body content only when mounted */}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ overflowY: "auto" }} 
      >
        <EdgeStoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={true}
          >
            <Navbar />
            {children}
          </ThemeProvider>
        </EdgeStoreProvider>
      </body>
    </html>
  );
}
