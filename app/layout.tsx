import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QR Order MVP',
  description: 'QR-based ordering sample UI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
