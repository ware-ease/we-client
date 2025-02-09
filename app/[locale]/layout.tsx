import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Inter } from 'next/font/google';
// import { Roboto } from 'next/font/google';
import '../globals.css';
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
  title: 'WareEase',
};

const inter = Inter({ subsets: ['vietnamese'] });
// const roboto = Roboto({
//   weight: '400',
//   subsets: ['latin'],
// });

export default async function RootLayout({
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

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.className}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ToastContainer />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
