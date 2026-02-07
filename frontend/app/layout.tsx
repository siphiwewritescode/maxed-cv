import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Maxed-CV',
    default: 'Maxed-CV - AI-Powered CV Tailoring for South Africa',
  },
  description:
    'Tailor your CV to any job description in seconds. AI-powered CV optimization for South African professionals. Beat ATS filters and land more interviews.',
  keywords: [
    'CV',
    'resume',
    'South Africa',
    'ATS',
    'job application',
    'AI',
    'CV tailoring',
    'CV optimization',
    'job search',
    'career',
  ],
  openGraph: {
    title: 'Maxed-CV - AI-Powered CV Tailoring for South Africa',
    description:
      'Tailor your CV to any job description in seconds. AI-powered CV optimization for South African professionals. Beat ATS filters and land more interviews.',
    type: 'website',
    locale: 'en_ZA',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" style={{
          position: 'absolute',
          left: '-9999px',
          zIndex: 999,
        }}>
          Skip to content
        </a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
