import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'CivicAI - AI-Powered Citizen Grievance Intelligence',
  description: 'AI-Enabled Citizen Grievance Prioritization and Resolution Assistant for TCS Tech Day Hackathon',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0f19] text-slate-100 min-h-screen antialiased flex flex-col lg:flex-row">
        <Navbar />
        <main className="flex-1 min-w-0 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
