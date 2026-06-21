import { useEffect } from "react"

export function useMotionSystem() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    if (reducedMotion) {
      document.documentElement.classList.add("motion-ready")
      return
    }

    const revealTargets = document.querySelectorAll<HTMLElement>(
      [
        ".section-header",
        ".timeline-item",
        ".music-quote",
        ".playlist-card",
        ".film-card",
        ".book-card",
        ".photo-item",
        ".note-form",
        ".public-notes",
        ".footer-main",
        ".footer-bottom",
      ].join(","),
    )

    revealTargets.forEach((element, index) => {
      element.classList.add("motion-reveal")
      element.style.setProperty("--reveal-order", String(index % 4))
    })

    document.documentElement.classList.add("motion-ready")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          entry.target.classList.add("is-revealed")
          observer.unobserve(entry.target)
        })
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.08,
      },
    )

    revealTargets.forEach((element) => observer.observe(element))

    const updateHeroMotion = () => {
      const scrollProgress = Math.min(window.scrollY, window.innerHeight)
      document.documentElement.style.setProperty(
        "--hero-scroll",
        `${scrollProgress}px`,
      )
    }

    updateHeroMotion()
    window.addEventListener("scroll", updateHeroMotion, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", updateHeroMotion)
    }
  }, [])
}
