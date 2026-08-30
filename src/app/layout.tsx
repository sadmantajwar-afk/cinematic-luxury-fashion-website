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
    <html lang="en" className="dark bg-black text-white">
      <body className="bg-black text-white antialiased selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}
