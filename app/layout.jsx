import { Geist, Geist_Mono } from "next/font/google";
import { robotoSlab } from "@/lib/fonts";
import "./globals.css";
import Navbar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "The Old Ladies Game Club",
  description: "Pick a game. Play it. Come back. Talk about it.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${robotoSlab.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden max-md:h-dvh max-md:snap-y max-md:snap-mandatory max-md:overflow-y-auto">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
