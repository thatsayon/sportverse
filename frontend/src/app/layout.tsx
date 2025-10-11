import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";
import { Toaster } from "sonner";
import Navbar from "@/components/Landing/Navbar";
import Footer from "@/components/Shared/Footer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open_sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ball Mastery",
  description: "Upscale your sports skill with proper guidance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${openSans.variable} font-open_sans antialiased`}
      >
        <StoreProvider>
          <Navbar/>
          <Toaster/>
          
          {children}
          <Footer/>
          </StoreProvider>
      </body>
    </html>
  );
}
