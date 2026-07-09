import type { Metadata, Viewport } from 'next';
import { Montserrat, Poppins } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Gautham Ram Karthik Official Fan Club',
  description:
    'The official fan club portal for Tamil actor Gautham Ram Karthik — filmography, welfare activities, media gallery, fan registration and more.',
  keywords: [
    'Gautham Ram Karthik',
    'Gautham Karthik',
    'Tamil Actor',
    'Fan Club',
    'GRK Fan Club',
    'Pathu Thala',
    'August 16 1947',
    'Mr. X',
  ],
  openGraph: {
    title: 'Gautham Ram Karthik Official Fan Club',
    description:
      'Join the official fan club portal for Tamil cinema actor Gautham Ram Karthik.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gautham Ram Karthik Official Fan Club',
    description:
      'Join the official fan club portal for Tamil cinema actor Gautham Ram Karthik.',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0F19',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`bg-background ${montserrat.variable} ${poppins.variable}`}
    >
      <body className="antialiased text-foreground bg-background font-sans">
        {children}
      </body>
    </html>
  );
}
