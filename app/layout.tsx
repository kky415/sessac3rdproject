import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react" // Added import for React
import { PaperProvider } from "./PaperContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Paper Reader",
  description: "Read and search academic papers",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PaperProvider>
          <main className="container mx-auto p-4">{children}</main>
        </PaperProvider>
      </body>
    </html>
  )
}

