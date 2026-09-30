import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://vigneshhospitaltumkur18.netlify.app"),
  title: "Vignesh Hospital | Child & Family Healthcare in Tumkur",
  description:
    "Vignesh Hospital, Yallapura, Tumkur: pediatrics, developmental pediatrics, newborn care, dental care, diagnostics and 24×7 emergency, admission, pharmacy and ECG.",
  icons: { icon: "/images/logo.jpg" },
  openGraph: {
    title: "Vignesh Hospital | Tumkur",
    description: "Comprehensive child & family healthcare. 24×7 emergency, admission, pharmacy and ECG.",
    type: "website",
    locale: "en_IN",
    images: ["/images/hospital-front.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#081C2E",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="bg-ink font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
