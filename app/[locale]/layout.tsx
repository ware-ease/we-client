import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import ReactQueryProvider from '@/app/_components/providers/ReactQueryProvider';
import { Inter } from 'next/font/google';
// import { Roboto } from 'next/font/google';
import '../globals.css';

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

  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.className}>
      <body>
        <ReactQueryProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
