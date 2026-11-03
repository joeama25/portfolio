'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

// 1. Add className to the props type
export function ScrollRevealText({ text, className = '' }: { text: string; className?: string }) {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start 0.9', 'start 0.25'],
  })

  const words = text.split(' ')

  return (
    // 2. Apply the className to the paragraph wrapper
    <p ref={container} className={className}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + 1 / words.length
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        )
      })}
    </p>
  )
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0, 1])
  const blur = useTransform(progress, range, ['blur(8px)', 'blur(0px)'])
  return (
    <span className="relative mr-2 inline-block">
      <motion.span style={{ opacity, filter: blur }}>{children}</motion.span>
    </span>
  )
}