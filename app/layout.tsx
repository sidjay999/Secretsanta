import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Secret Santa · Winter Night",
  description: "A cinematic, cozy Secret Santa reveal for your private club."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-winter-vertical text-slate-100">
        {children}
      </body>
    </html>
  );
}


