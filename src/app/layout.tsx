import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Providers from "@/components/Providers";
import TopBar from "@/components/TopBar";

export const metadata: Metadata = {
  title: "Veritas Verify — Document Verification Platform",
  description: "AI-powered document verification platform for government agencies. OCR, RAG, and automated verification pipelines.",
  metadataBase: new URL("https://veritas-verify.netlify.app"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Thai:wght@400;500;600;700&family=Source+Serif+4:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased text-ink bg-paper">
        <Providers>
          <TopBar />
          <Sidebar />
          <main className="lg:pl-64 min-h-screen">
            <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
