"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { ReactNode, useState, useEffect } from "react";
import Script from "next/script";
import MainHeader from "@/components/layout/MainHeader";
import Splash from "@/components/Splash";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000); // 2 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <head>
        {/* Bootstrap Icons CDN */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
        />
      </head>
      <body>
        {showSplash && <Splash />}
        <MainHeader />
        <main>{children}</main>

        {/* Bootstrap JS */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
