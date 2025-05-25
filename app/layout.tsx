import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Performance Dashboard",
  description: "Page Performance Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
