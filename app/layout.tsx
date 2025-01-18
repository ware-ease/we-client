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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
