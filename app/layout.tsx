import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "TaskFlow | Manage Your Projects",
  description: "A modern task management application built with Next.js and Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900">
        <Providers>
          <div className="flex h-screen overflow-hidden text-sm md:text-base">
            <main className="flex-1 overflow-y-auto bg-white shadow-inner">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
