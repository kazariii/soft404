import { useEffect, useRef, useState } from "react"
import TodayPlan from "./components/TodayPlan"
import CinemaCorner from "./components/CinemaCorner"
import ReadingCorner from "./components/ReadingCorner"
import PhotoGallery from "./components/PhotoGallery"
import SpotifySection from "./components/SpotifySection"
import AnonymousNotes from "./components/AnonymousNotes"
import Footer from "./components/Footer"
import FallingLeaves from "./components/FallingLeaves"
import PageOpening from "./components/PageOpening"
import AmbientGlow from "./components/AmbientGlow"
import { useMotionSystem } from "./hooks/useMotionSystem"
import { useHeroParallax } from "./hooks/useHeroParallax"

const navItems = [
  { label: "Today", href: "#today" },
  { label: "Melodies", href: "#music" },
  { label: "Stories", href: "#cinema" },
  { label: "Pages", href: "#reading" },
  { label: "Frames", href: "#photos" },
  { label: "Postcards", href: "#notes" },
]

type Theme = "light" | "dark"

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem("soft404-theme")

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [themeTransition, setThemeTransition] = useState<Theme | null>(null)
  const transitionTimers = useRef<number[]>([])
  const heroRef = useHeroParallax()
  useMotionSystem()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    localStorage.setItem("soft404-theme", theme)
  }, [theme])

  useEffect(() => {
    return () => {
      transitionTimers.current.forEach(window.clearTimeout)
    }
  }, [])

  const toggleTheme = () => {
    if (themeTransition) return

    const nextTheme = theme === "light" ? "dark" : "light"
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    if (prefersReducedMotion) {
      setTheme(nextTheme)
      return
    }

    setThemeTransition(nextTheme)
    transitionTimers.current = [
      window.setTimeout(() => setTheme(nextTheme), 520),
      window.setTimeout(() => {
        setThemeTransition(null)
        transitionTimers.current = []
      }, 1220),
    ]
  }

  return (
    <main>
      <PageOpening />
      {themeTransition && (
        <div
          className={`theme-transition theme-transition-${themeTransition}`}
          aria-hidden="true"
        >
          <span className="theme-transition-sun" />
          <span className="theme-transition-horizon" />
        </div>
      )}
      <AmbientGlow />
      <FallingLeaves />
      <nav className="site-nav" aria-label="Main navigation">
        <a className="wordmark" href="#top" aria-label="soft404 home">
          soft<span>404</span>
        </a>

        <div className="nav-links">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            disabled={themeTransition !== null}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            <span className="theme-toggle-track">
              <span className="theme-toggle-thumb">
                {theme === "light" ? "☼" : "☾"}
              </span>
            </span>
            <span className="theme-toggle-label">{theme}</span>
          </button>

          <a className="nav-cta" href="#footer">
            find me elsewhere
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>

      <section className="hero-section" id="top" ref={heroRef}>
        <div className="hero-orbit hero-orbit-one" />
        <div className="hero-orbit hero-orbit-two" />
        <div className="hero-copy">
          <div className="eyebrow">
            <span />
            a tender archive · kept since 2024
          </div>

          <h1>
            For all the little things
            <br />
            <em>the heart refuses to lose.</em>
          </h1>

          <p className="hero-intro">
            A quiet home for melodies that linger, stories that ache, and
            ordinary moments that became precious only after they passed.
          </p>

          <div className="hero-actions">
            <a className="button button-dark" href="#music">
              wander through the archive
              <span aria-hidden="true">↓</span>
            </a>
            <span className="hero-note">gathered softly by kazari</span>
          </div>
        </div>

        <div className="hero-stamp" aria-hidden="true">
          <span>held gently</span>
          <strong>✦</strong>
          <span>remembered dearly</span>
        </div>

        <div className="scroll-cue">
          <span>begin wandering</span>
          <div />
        </div>
      </section>

      <TodayPlan />
      <SpotifySection />
      <CinemaCorner />
      <ReadingCorner />
      <PhotoGallery />
      <AnonymousNotes />
      <Footer />
    </main>
  )
}

export default App
