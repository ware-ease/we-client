import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// import { Roboto } from 'next/font/google';
import './globals.css';

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

  return (
    <html lang={locale} className={`${inter.className}`}>
      <body className='overflow-hidden'>{children}</body>
    </html>
  );
}
