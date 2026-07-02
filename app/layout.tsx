import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '그린짐 경영 대시보드',
  description: '트레이너 전용 경영 대시보드',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className} style={{ backgroundColor: '#0F1117', color: '#FFFFFF' }}>
        {children}
      </body>
    </html>
  )
}
