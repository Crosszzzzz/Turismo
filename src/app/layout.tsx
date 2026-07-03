import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SmartTour — Tu guía inteligente',
  description: 'Explorá Sucre con rutas personalizadas generadas por IA. Turismo gratuito y accesible.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SmartTour',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4f46e5',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoIhABEgkFnRE/BKUzLEbQg8lb2q3dFq6L2cCY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-dvh bg-gray-50 text-gray-900 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
