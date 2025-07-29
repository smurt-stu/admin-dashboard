import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutContent from './LayoutContent';

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "متجري - متجر إلكتروني متكامل",
  description: "متجر إلكتروني متكامل يقدم أفضل المنتجات بأسعار مناسبة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutContent>
          {children}
        </LayoutContent>
      </body>
    </html>
  );
}
