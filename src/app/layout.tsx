import type {Metadata} from 'next';
import './globals.css';
import { Poppins } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans' 
});

export const metadata: Metadata = {
  title: 'Drvyn Dashboard',
  description: 'A modern CRM/Dashboard for car services.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', poppins.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
