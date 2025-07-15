import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});




export const metadata: Metadata = {
  title: "CloudNest – Minimal File Storage",
  description:
    "Upload, organize, and share files with CloudNest – a clean, fast, and secure file storage app.",
  metadataBase: new URL("https://cloudnest-navy.vercel.app"), 
  openGraph: {
    title: "CloudNest – Minimal File Storage",
    description:
      "Experience the fastest and cleanest file upload interface.",
    url: "https://cloudnest-navy.vercel.app",
    siteName: "CloudNest",
    images: [
      {
        url: "https://cloudnest-navy.vercel.app/og.png",
        width: 1200,
        height: 630,
        alt: "CloudNest App Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CloudNest – Minimal File Storage",
    description: "Experience clean, fast file uploads and organization.",
    images: ["https://cloudnest-navy.vercel.app/og.png"],
  },
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider 
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        >
          {children}

        </ThemeProvider>
        
        <Toaster position="top-right" richColors />
      </body>
    </html>

    </ClerkProvider>
    
  );
}
