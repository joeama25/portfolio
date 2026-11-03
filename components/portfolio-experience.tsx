'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { ArrowDownRight, ArrowUpRight, Code2, Globe, Menu, MoveUpRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { TypingText, ScrollReveal } from '@/components/animations'
import { Magnetic } from '@/components/magnetic'
import { ScrollRevealText } from '@/components/scroll-reveal-text'
import { submitInquiry } from '@/app/actions/contact'

type DBProject = {
  id: string
  title: string
  description: string
  stack: string
  url: string | null
  image: string | null
  featured: boolean
  createdAt: Date
}

const skills = [
  ['Frontend', ['HTML5', 'CSS3', 'React']],
  ['Backend + data', ['MongoDB', 'SQL']],
  ['Languages', ['C#', 'Java', 'Python']],
  ['Mobile', ['Flutter', 'Dart']],
] as const

const processSteps = [
  { title: 'Discover', desc: 'Researching the problem space, understanding user needs, and defining the scope.' },
  { title: 'Plan', desc: 'Mapping out the architecture, choosing the right stack, and setting milestones.' },
  { title: 'Design', desc: 'Wireframing, prototyping, and crafting the visual language of the product.' },
  { title: 'Develop', desc: 'Writing clean, scalable code and bringing the designs to life.' },
  { title: 'Test', desc: 'Ensuring everything works flawlessly across devices and edge cases.' },
  { title: 'Deploy', desc: 'Shipping to production and monitoring for performance and stability.' },
]

export function PortfolioExperience({ projects = [] }: { projects?: DBProject[] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState('All')
  const [activeSkill, setActiveSkill] = useState('React')
  const [navTheme, setNavTheme] = useState<'dark' | 'light' | 'lime'>('dark')
  const [openStep, setOpenStep] = useState<number | null>(null)
  
  // 1. ADDED STATE: Tracks the current section for the active nav highlight
  const [activeSection, setActiveSection] = useState('top') 
  
  const filters = ['All', 'Frontend', 'Full-stack', 'Mobile']

  // PIXEL-PERFECT NAVBAR SCROLL LISTENER
  useEffect(() => {
    let ticking = false

    const updateNavTheme = () => {
      const navHeight = 80
      const sections = document.querySelectorAll('section, footer')
      let currentTheme = 'dark'
      let currentActive = 'top' // Default to top

      sections.forEach(section => {
        const rect = section.getBoundingClientRect()
        
        // If the top of the section crosses the navbar line
        if (rect.top <= navHeight + 20) { 
          const id = section.id
          currentActive = id // Update the active section

          if (id === 'top' || id === 'expertise') currentTheme = 'dark'
          else if (id === 'process') currentTheme = 'lime'
          else currentTheme = 'light'
        }
      })

      setNavTheme(currentTheme as 'dark' | 'light' | 'lime')
      setActiveSection(currentActive) // Set the active link
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavTheme)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    updateNavTheme() // Initial check on load

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // PROJECT SPOTLIGHT MOUSE TRACKER
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
  }

  const formattedProjects = useMemo(() => {
    return projects.map((project, index) => {
      const stackArray = project.stack.split(',').map(s => s.trim())
      let type = 'Frontend'
      if (stackArray.some(s => ['SQL', 'MongoDB', 'Node.js'].includes(s))) type = 'Full-stack'
      if (stackArray.some(s => ['Flutter', 'Dart', 'React Native'].includes(s))) type = 'Mobile'

      return {
        id: project.id,
        title: project.title,
        description: project.description,
        stack: stackArray,
        url: project.url,
        image: project.image,
        type,
        year: new Date(project.createdAt).getFullYear().toString(),
        tone: ['lime', 'cream', 'blue'][index % 3],
      }
    })
  }, [projects])

  const visibleProjects = useMemo(() => {
    return filter === 'All'
      ? formattedProjects
      : formattedProjects.filter((project) => project.type === filter)
  }, [filter, formattedProjects])

  const navLinks = ['About', 'Expertise', 'Projects', 'Process', 'Contact']

  return (
    <main className="portfolio-shell">
      {/* DYNAMIC NAVBAR */}
      <header className={`site-nav nav-theme-${navTheme}`}>
        <a className="wordmark" href="#top" aria-label="Joe Ama home"><span>AM</span><i /></a>

        <motion.button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          whileTap={{ scale: 0.9 }}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        >
          {menuOpen ? <X /> : <Menu />}
        </motion.button>

        {/* DESKTOP NAV */}
        <nav className="nav-links desktop-nav" aria-label="Main navigation">
          {navLinks.map((item) => {
            // 2. APPLY ACTIVE CLASS
            const isActive = activeSection === item.toLowerCase();
            return (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className={isActive ? 'active' : ''}
              >
                {item}
              </a>
            )
          })}
          <a className="nav-cta" href="#contact">Let&apos;s work together <ArrowUpRight /></a>
        </nav>

        {/* MOBILE NAV OVERLAY */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="nav-links mobile-nav-overlay"
              aria-label="Mobile navigation"
            >
              {navLinks.map((item, i) => {
                // 3. APPLY ACTIVE CLASS TO MOBILE
                const isActive = activeSection === item.toLowerCase();
                return (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (i * 0.05) }}
                    whileTap={{ scale: 0.95 }}
                    className={isActive ? 'active' : ''}
                  >
                    {item}
                  </motion.a>
                )
              })}
              <motion.a
                className="nav-cta"
                href="#contact"
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + (navLinks.length * 0.05) }}
                whileTap={{ scale: 0.95 }}
              >
                Let&apos;s work together <ArrowUpRight />
              </motion.a>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> Available for projects <span className="mono">/ 2026</span></p>
          <h1>Building <em>digital</em><br />experiences<br /><span>through code.</span></h1>
          <p className="hero-intro">
            <TypingText text="I'm Joe Ama. A developer exploring the intersection of technology, logic and creativity to build meaningful digital solutions." />
          </p>
          <div className="hero-actions">
            <Magnetic>
              <motion.a whileTap={{ scale: 0.95 }} className="button button-primary" href="#projects">View my work <ArrowDownRight /></motion.a>
            </Magnetic>
            <Magnetic>
              <motion.a whileTap={{ scale: 0.95 }} className="text-link" href="#contact">Let&apos;s connect <ArrowUpRight /></motion.a>
            </Magnetic>
          </div>
        </div>
        <div className="hero-visual" aria-label="Abstract rotating technical composition" role="img">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="core"><span>CREATE</span><strong>∞</strong><span>ITERATE</span></div>
          <div className="visual-label visual-label-top">A / 01<br /><span>Creative systems</span></div><div className="visual-label visual-label-bottom">Logic + instinct<br /><span>Always in motion</span></div>
        </div>
        <a className="scroll-cue" href="#about"><span>Scroll to explore</span><ArrowDownRight /></a>
      </section>

      {/* ABOUT SECTION */}
      <section className="about section-light" id="about">
        <ScrollReveal>
          <div className="section-index">01 / About</div>
        </ScrollReveal>

        <div className="about-grid">
          <ScrollReveal delay={100}>
            <p className="kicker">A developer with a point of view.</p>
            <h2>Curious by nature.<br /><span>Precise by practice.</span></h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="about-body">
              <ScrollRevealText
                className="lead"
                text="I like making things that feel simple, even when the thinking behind them is not."
              />
              <p>My journey has moved between interfaces, APIs, databases and mobile applications. Each project is an opportunity to make something useful, considered and a little more human.</p>
              <p>I&apos;m drawn to the details: the way a system behaves under pressure, the rhythm of a well-made interaction, and the quiet satisfaction of a problem solved cleanly.</p>
              <a className="underlined-link" href="#contact">More about my approach <ArrowUpRight /></a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* EXPERTISE SECTION */}
      <section className="expertise" id="expertise">
        <ScrollReveal>
          <div className="section-index">02 / Expertise</div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div className="expertise-heading">
            <p className="kicker">Tools of the trade</p>
            <h2>Many languages.<br /><span>One mindset.</span></h2>
          </div>
        </ScrollReveal>

        <div className="skills-layout">
          <ScrollReveal delay={200}>
            <div className="skills-list">
              {skills.map(([category, items]) => (
                <div className="skill-group" key={category}>
                  <p>{category}</p>
                  <div>
                    {items.map((skill) => (
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        className={activeSkill === skill ? 'skill-pill active' : 'skill-pill'}
                        key={skill}
                        onClick={() => setActiveSkill(skill)}
                      >
                        {skill}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="skill-detail">
              <span className="detail-number">0{(skills.flatMap(([, items]) => items) as readonly string[]).indexOf(activeSkill) + 1}</span>
              <div key={activeSkill} className="animate-skill-text">
                <h3>{activeSkill}</h3>
                <p>{activeSkill} is one part of a broader toolkit I use to turn a loose idea into something resilient, responsive and ready for the real world.</p>
              </div>
              <div className="detail-line"><span>Current focus</span><span>Building better systems</span></div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className="projects section-light" id="projects">
        <ScrollReveal>
          <div className="section-index">03 / Selected work</div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div className="projects-heading">
            <div><p className="kicker">A few things I&apos;ve made</p><h2>Work that <em>moves</em><br />the conversation.</h2></div>
            <p>Projects are where ideas become tangible. A selection of experiments, applications and collaborative builds.</p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <div className="filter-row" role="group" aria-label="Filter projects">
            {filters.map((item) => (
              <motion.button
                whileTap={{ scale: 0.9 }}
                key={item}
                onClick={() => setFilter(item)}
                className={filter === item ? 'filter active' : 'filter'}
              >
                {item}
              </motion.button>
            ))}
          </div>
        </ScrollReveal>

        <div className="project-grid">
          {visibleProjects.length > 0 ? (
            visibleProjects.map((project, index) => (
              <ScrollReveal key={project.id} delay={index * 150} className="h-full">
                <motion.article
                  className={`project-card project-${project.tone} h-full`}
                  onMouseMove={handleMouseMove}
                  whileHover={{ y: -10, scale: 1.02 }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="project-spotlight" />
                                    <div className="project-art">
                    <span className="project-art-number">0{index + 1}</span>
                    
                    {/* Conditionally render the image if it exists */}
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="project-image" />
                    ) : (
                      <>
                        <div className="art-lines" />
                        <div className="art-orb" />
                      </>
                    )}
                  </div>
                  <div className="project-meta">
                    <span>{project.type}</span>
                    <span>{project.year}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-footer">
                    <span>{project.stack.join('  /  ')}</span>
                    {project.url ? (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title}`}>
                        <MoveUpRight />
                      </a>
                    ) : (
                      <MoveUpRight />
                    )}
                  </div>
                </motion.article>
              </ScrollReveal>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground" style={{ gridColumn: '1 / -1' }}>
              <p>No projects match the current filter or there are no featured projects yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="process" id="process">
        <ScrollReveal>
          <div className="section-index">04 / Process</div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div className="process-intro">
            <p className="kicker">How I work</p>
            <h2>From first thought<br /><span>to final detail.</span></h2>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <div className="process-list">
            {processSteps.map((step, index) => {
              const isOpen = openStep === index;
              return (
                <motion.div
                  layout // Smoothly animates height changes
                  onClick={() => setOpenStep(isOpen ? null : index)}
                  className={`process-step ${isOpen ? 'is-open' : ''}`}
                  key={step.title}
                  style={{ cursor: 'pointer' }}
                >
                  <span>0{index + 1}</span>
                  <div className="process-step-content">
                    <strong>{step.title}</strong>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.p
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: 'auto', opacity: 1, marginTop: 10 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          className="process-desc"
                          style={{ overflow: 'hidden' }}
                        >
                          {step.desc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
                    <ArrowUpRight />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </ScrollReveal>
      </section>

      {/* CONTACT SECTION */}
      <section className="contact section-light" id="contact">
        <ScrollReveal>
          <div className="section-index">05 / Contact</div>
        </ScrollReveal>

        <div className="contact-grid">
          {/* Left Side: Text & Email */}
          <ScrollReveal delay={100}>
            <div className="contact-content">
              <p className="kicker">Have an idea?</p>
              <h2>Let&apos;s build something<br /><em>remarkable.</em></h2>
              <Magnetic>
                <motion.a whileTap={{ scale: 0.95 }} className="contact-email" href="mailto:joeama25@gmail.com">
                  joeama25@gmail.com <ArrowUpRight />
                </motion.a>
              </Magnetic>

              <div className="contact-bottom">
                <span>Open to thoughtful collaborations<br />and interesting problems.</span>
                <div className="socials">
                  <motion.a whileTap={{ scale: 0.85 }} href="https://github.com" aria-label="GitHub"><Code2 /></motion.a>
                  <motion.a whileTap={{ scale: 0.85 }} href="https://example.com" aria-label="Website"><Globe /></motion.a>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Side: The Form */}
          <ScrollReveal delay={200}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </section>

      <footer>
        <span>© 2026 Joe Ama</span>
        <span>Designed & built with intention.</span>
        <span className="mono">AM / 001</span>
      </footer>
    </main>
  )
}

function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)
    const result = await submitInquiry(formData)

    if (result?.error) {
      setErrorMessage(result.error)
      setStatus('error')
    } else {
      setStatus('success')
      formRef.current?.reset()
      // Reset back to idle after 4 seconds
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <div className="form-wrapper">
      {status === 'success' ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="form-success"
        >
          <div className="success-icon">✓</div>
          <h3>Message Sent!</h3>
          <p>Thank you for reaching out. I&apos;ll get back to you shortly.</p>
        </motion.div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label>Name</label>
            <input name="name" type="text" required placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" required placeholder="john@example.com" />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea name="message" required placeholder="Tell me about your project..." rows={4} />
          </div>

          {status === 'error' && <p className="form-error">{errorMessage}</p>}

          <motion.button 
            type="submit" 
            className="form-submit"
            disabled={status === 'loading'}
            whileTap={{ scale: 0.98 }}
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
            
            {/* The Progress Bar */}
            {status === 'loading' && (
              <motion.div 
                className="progress-bar"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />
            )}
          </motion.button>
        </form>
      )}
    </div>
  )
}