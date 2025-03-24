import { routing } from '@/lib/i18n/routing';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import ReactQueryProvider from '@/components/providers/ReactQueryProvider';
import { ToastContainer } from 'react-toastify';
// import { Roboto } from 'next/font/google';
import '../globals.css';
import { AuthProvider } from '../../components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'WareEase',
};

export default async function NotRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <ReactQueryProvider>
      <AuthProvider>
        <NextIntlClientProvider messages={messages}>
          <ToastContainer />
          {children}
        </NextIntlClientProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
