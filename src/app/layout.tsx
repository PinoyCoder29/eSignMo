import MainHeader from "@/components/layout/MainHeader";
import 'bootstrap/dist/css/bootstrap.min.css';
import Script from "next/script";
  
import { ReactNode } from "react";


  export default function Layout({children}: {children: ReactNode}) {
    return (
      <>
    <html>
      <head>
        <title>eSignMo</title>
        <link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
      </head>
      <body>
        <MainHeader/>
        <main>{children}</main>
      
      <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" 
          strategy="beforeInteractive" 
        />
      </body>
      </html>
      </>
    );
  }
