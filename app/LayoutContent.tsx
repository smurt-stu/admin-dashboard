'use client';

import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePathname } from 'next/navigation';
import { ToastProvider } from '../components/ui/toast';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return (
      <ToastProvider>
        <main className="min-h-screen">
          {children}
        </main>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </ToastProvider>
  );
} 