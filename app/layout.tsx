import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CognIAlysis — Quel profil IA es-tu ?",
  description: "Découvrez quel modèle d'IA correspond à votre personnalité grâce à votre signe astrologique et votre profil Big Five.",
  openGraph: {
    title: "CognIAlysis — Quel profil IA es-tu ?",
    description: "Analyse psychologique IA · Big Five · Matching humain ⇄ IA",
    images: [{ url: "/api/og?ia=claude&score=0.92&source=test&mode=test", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-950 text-white">{children}</body>
    </html>
  );
}
