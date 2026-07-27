import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Marketplace",
    template: "%s | Marketplace",
  },
  description: "Marketplace de proyectos del laboratorio Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased md:flex`}
      >
        <a
          href="#main-content"
          className="fixed left-4 top-3 z-60 -translate-y-20 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg transition-transform focus:translate-y-0 focus:outline-2 focus:outline-offset-2 focus:outline-ring"
        >
          Saltar al contenido
        </a>
        <Sidebar />
        <main
          id="main-content"
          className="min-h-[calc(100dvh-4rem)] min-w-0 flex-1 px-4 py-6 sm:px-6 md:min-h-screen md:px-8 md:py-8 lg:px-10"
        >
          {children}
        </main>
      </body>
    </html>
  );
}
