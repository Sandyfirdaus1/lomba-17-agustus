import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackendStatus from "@/components/BackendStatus";
import ClientOnly from "@/components/ClientOnly";

export const metadata: Metadata = {
  title: "Lomba 17 Agustus",
  description: "Website resmi lomba 17 Agustus RT/RW",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning={true}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ClientOnly>
          <BackendStatus />
        </ClientOnly>
      </body>
    </html>
  );
}
