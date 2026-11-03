import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Joe Ama — Product Designer & Creative Technologist',
  description: 'A developer exploring the intersection of technology, logic and creativity to build meaningful digital solutions.',
  keywords: ['Developer', 'Product Designer', 'Creative Technologist', 'React', 'Next.js', 'Portfolio'],
  authors: [{ name: 'Joe Ama' }],
  creator: 'Joe Ama',
  // Open Graph tags for social media (LinkedIn, Twitter, etc.)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com', // Replace with your actual domain when deployed
    title: 'Joe Ama — Product Designer & Creative Technologist',
    description: 'Building digital experiences through code.',
    siteName: 'Joe Ama Portfolio',
    images: [
      {
        // You will need to create an image (1200x630px) and put it in your public folder
        url: 'https://your-domain.com/og-image.jpg', 
        width: 1200,
        height: 630,
        alt: 'Joe Ama Portfolio Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joe Ama — Developer',
    description: 'Building digital experiences through code.',
    images: ['https://your-domain.com/og-image.jpg'],
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}