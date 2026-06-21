import { useEffect, useRef } from "react"

export function useHeroParallax() {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const supportsPointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    if (!hero || !supportsPointer || reducedMotion) return

    let frameId = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const animate = () => {
      currentX += (targetX - currentX) * 0.075
      currentY += (targetY - currentY) * 0.075

      hero.style.setProperty("--pointer-x", currentX.toFixed(3))
      hero.style.setProperty("--pointer-y", currentY.toFixed(3))
      frameId = requestAnimationFrame(animate)
    }

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect()
      targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
      targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2
    }

    const handlePointerLeave = () => {
      targetX = 0
      targetY = 0
    }

    hero.addEventListener("pointermove", handlePointerMove)
    hero.addEventListener("pointerleave", handlePointerLeave)
    frameId = requestAnimationFrame(animate)

    return () => {
      hero.removeEventListener("pointermove", handlePointerMove)
      hero.removeEventListener("pointerleave", handlePointerLeave)
      cancelAnimationFrame(frameId)
    }
  }, [])

  return heroRef
}
