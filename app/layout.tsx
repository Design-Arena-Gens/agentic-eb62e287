import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jonny - Your Personal AI Agent",
  description: "Ultra-advanced personal AI assistant with emotional intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
