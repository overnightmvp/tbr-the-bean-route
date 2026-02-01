import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Bean Route — Melbourne's Mobile Coffee Cart Marketplace",
  description: "Find and book mobile coffee carts for your next event in Melbourne. Corporate mornings, weddings, festivals — free to inquire.",
  openGraph: {
    title: "The Bean Route — Melbourne's Mobile Coffee Cart Marketplace",
    description: "Find and book mobile coffee carts for your next event in Melbourne. Corporate mornings, weddings, festivals — free to inquire.",
    type: "website",
    url: "https://thebeanroute.com.au",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}