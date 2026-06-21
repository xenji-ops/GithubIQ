import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "GitHubIQ – GitHub Profile Analyzer",
  description:
    "Analyze any GitHub profile in seconds. Get developer scores, repository quality assessments, language intelligence, and career recommendations.",
  keywords: [
    "GitHub",
    "profile analyzer",
    "developer report",
    "GitHub stats",
    "coding analytics",
    "portfolio analysis",
    "career recommendations",
  ],
  authors: [{ name: "Adit Aggarwal", url: "mailto:androgamer621@gmail.com" }],
  openGraph: {
    title: "GitHubIQ – GitHub Profile Analyzer",
    description:
      "Analyze any GitHub profile. Get developer scores, repo quality, and career insights.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg-primary text-text-primary font-sans antialiased">
        <Header />
        <main className="pt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
