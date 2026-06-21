import { useEffect, useRef } from "react"

const glowColors: Record<string, string> = {
  top: "132, 87, 62",
  today: "157, 108, 76",
  music: "209, 145, 98",
  cinema: "151, 91, 60",
  reading: "180, 126, 88",
  photos: "218, 145, 78",
  notes: "169, 105, 74",
  footer: "128, 77, 53",
}

function AmbientGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const glow = glowRef.current
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(
        "#top, #today, #music, #cinema, #reading, #photos, #notes, #footer",
      ),
    )
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    if (!glow || sections.length === 0) return

    let frameId = 0
    let targetX = window.innerWidth * 0.72
    let targetY = window.innerHeight * 0.45
    let currentX = targetX
    let currentY = targetY
    let currentColor = glowColors.top

    const updateTarget = () => {
      const viewportCenter = window.innerHeight / 2
      let activeSection = sections[0]
      let closestDistance = Number.POSITIVE_INFINITY

      sections.forEach((section) => {
        const bounds = section.getBoundingClientRect()
        const visibleTop = Math.max(bounds.top, 0)
        const visibleBottom = Math.min(bounds.bottom, window.innerHeight)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)

        if (visibleHeight === 0) return

        const sectionCenter = (visibleTop + visibleBottom) / 2
        const distance = Math.abs(sectionCenter - viewportCenter)

        if (distance < closestDistance) {
          closestDistance = distance
          activeSection = section
        }
      })

      const bounds = activeSection.getBoundingClientRect()
      const sectionIndex = sections.indexOf(activeSection)
      targetX =
        sectionIndex % 2 === 0
          ? window.innerWidth * 0.74
          : window.innerWidth * 0.28
      targetY = Math.min(
        Math.max(bounds.top + bounds.height * 0.42, window.innerHeight * 0.24),
        window.innerHeight * 0.76,
      )
      currentColor = glowColors[activeSection.id] ?? glowColors.top
      glow.style.setProperty("--glow-color", currentColor)
    }

    const animate = () => {
      const smoothing = reducedMotion ? 1 : 0.055
      currentX += (targetX - currentX) * smoothing
      currentY += (targetY - currentY) * smoothing

      glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`
      frameId = requestAnimationFrame(animate)
    }

    updateTarget()
    frameId = requestAnimationFrame(animate)
    window.addEventListener("scroll", updateTarget, { passive: true })
    window.addEventListener("resize", updateTarget)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("scroll", updateTarget)
      window.removeEventListener("resize", updateTarget)
    }
  }, [])

  return <div className="ambient-glow" ref={glowRef} aria-hidden="true" />
}

export default AmbientGlow
