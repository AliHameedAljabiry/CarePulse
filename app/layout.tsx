import { cn } from '@/lib/utils';
import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from "next-themes";
import { Toaster } from '@/components/ui/toaster';
import { AuthProviders } from '@/components/auth/Providers';


const fontSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['300','400', '500', '600', '700'],
  variable: '--font-sans'
 });

export const metadata: Metadata = {
  title: 'CarePulse',
  description: 'A healthcare management system for modern clinics.',
  authors: [{ name: 'Ali Hameed' }],
  creator: 'Ali Hameed',
  publisher: 'Ali Hameed',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-app-url',
    title: 'CarePulse',
    description: 'A healthcare management system for modern clinics',
    siteName: 'CarePulse',
    images: [
      {
        url: 'https://your app image.png',
        width: 1200,
        height: 630,
        alt: '',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CarePulse',
    description: 'A healthcare management system for modern clinics',
    images: ['https://your-nextjs-app-url.com/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-light-300  dark:bg-dark-300 font-sans antialiased', fontSans.variable)}>
        <AuthProviders>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </AuthProviders>
        <Toaster />
      </body>
    </html>
  );
}