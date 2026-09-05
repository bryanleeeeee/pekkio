import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";
const dm = DM_Sans({ subsets: ["latin"], variable: "--font-dm" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
export const metadata: Metadata = {
  title: "Pek Kio — Your neighbourhood, discovered.",
  description:
    "Real places, good food and local stories. Explore Pek Kio through your friendly neighbourhood guide.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-SG" className={`${dm.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
