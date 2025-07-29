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
  title: {
    default: "متجري - متجر إلكتروني متكامل",
    template: "%s | متجري"
  },
  description: "متجر إلكتروني متكامل يقدم أفضل المنتجات بأسعار مناسبة مع لوحة إدارة شاملة",
  keywords: ["متجر إلكتروني", "تسوق أونلاين", "منتجات", "إدارة متجر", "e-commerce"],
  authors: [{ name: "متجري" }],
  creator: "متجري",
  publisher: "متجري",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://your-domain.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://your-domain.vercel.app',
    title: 'متجري - متجر إلكتروني متكامل',
    description: 'متجر إلكتروني متكامل يقدم أفضل المنتجات بأسعار مناسبة',
    siteName: 'متجري',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'متجري - متجر إلكتروني متكامل',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'متجري - متجر إلكتروني متكامل',
    description: 'متجر إلكتروني متكامل يقدم أفضل المنتجات بأسعار مناسبة',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
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
