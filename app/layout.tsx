import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Pek Kio — A little neighbourhood. A lot to love.",
  description:
    "Your friendly guide to Pek Kio, Singapore. Discover hawker favourites, things to do, community news and a fresh start in your neighbourhood.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-SG">
      <body>{children}</body>
    </html>
  );
}
