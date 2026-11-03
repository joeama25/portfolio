'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'

// 1. Typing Animation Component
export function TypingText({ text, speed = 40 }: { text: string, speed?: number }) {
  const [displayedText, setDisplayedText] = useState('')
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1))
      i++
      if (i === text.length) {
        clearInterval(timer)
        setIsDone(true)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  return (
    <span>
      {displayedText}
      {!isDone && <span className="animate-pulse text-[var(--lime)]">|</span>}
    </span>
  )
}

// 2. Scroll Reveal Component
export function ScrollReveal({ 
  children, 
  delay = 0, 
  className = '' 
}: { 
  children: ReactNode, 
  delay?: number,
  className?: string 
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target) // Stop observing once it's visible
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}