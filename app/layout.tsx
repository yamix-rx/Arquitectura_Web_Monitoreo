import type React from "react"
import type { Metadata } from "next"
import { Rajdhani, Share_Tech_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
})

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-share-tech",
})

export const metadata: Metadata = {
  title: "Futuristic IoT Dashboard",
  description: "Real-time monitoring system",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${rajdhani.variable} ${shareTechMono.variable} font-sans antialiased bg-[#020617] text-white`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
