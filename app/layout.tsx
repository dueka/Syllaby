import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "./auth/auth";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Book App for SyllabyCreate",
  description: "|| Create books and sections",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </AuthProvider>
  );
}
