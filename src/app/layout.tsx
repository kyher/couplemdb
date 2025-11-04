import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoupleMDB",
  description: "Track your couple movie experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white min-h-screen">
        <main className="flex flex-col gap-4 font-mono p-6">{children}</main>
      </body>
    </html>
  );
}
