'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="not-found-shell">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="not-found-content"
      >
        <p className="eyebrow" style={{ justifyContent: 'center' }}>
          <span className="status-dot" /> 404 / Lost in space
        </p>
        <h1>Page not <em>found.</em></h1>
        <p>The page you are looking for doesn&apos;t exist, has been moved, or is hiding from the algorithm.</p>
        
        <Link href="/" className="button button-primary">
          <ArrowLeft /> Back to home
        </Link>
      </motion.div>
    </main>
  )
}