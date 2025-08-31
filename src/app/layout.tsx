import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Wiinta OS - Emotionally Intelligent Voice-First Operating System',
  description: 'An emotionally intelligent voice-first operating system that prioritizes empathy and ambient interaction over traditional GUI elements.',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black">
        {children}
      </body>
    </html>
  );
}