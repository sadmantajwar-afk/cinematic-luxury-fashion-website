import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "DREV | High Fashion Campaign & Runway Archive",
  description: "DREV - Architectural streetwear and minimalist luxury tailoring. Defined forms, monochrome restraint, artisanal craftsmanship, and deconstructed silhouettes crafted in Bangladesh.",
  keywords: ["DREV", "luxury fashion", "architectural streetwear", "monochrome clothing", "designer overcoat", "dhaka tailoring", "made in bangladesh"],
  openGraph: {
    title: "DREV | Define Your Form",
    description: "Monochrome luxury streetwear and architectural tailoring.",
    siteName: "DREV",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("drev_theme");if(t==="light"){document.documentElement.classList.add("light");document.documentElement.classList.remove("dark");document.documentElement.setAttribute("data-theme","light");}else{document.documentElement.classList.add("dark");document.documentElement.classList.remove("light");document.documentElement.setAttribute("data-theme","dark");}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}
