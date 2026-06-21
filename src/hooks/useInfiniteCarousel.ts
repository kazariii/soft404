import { useCallback, useEffect, useRef } from "react"

type CarouselElement = HTMLDivElement

export function useInfiniteCarousel(
  cardSelector: string,
  pixelsPerSecond = 10,
  autoPlay = false,
) {
  const trackRef = useRef<CarouselElement>(null)
  const movingRef = useRef(autoPlay)
  const clickedRef = useRef(false)
  const scrollPositionRef = useRef(0)

  const normalizeLoop = useCallback(() => {
    const track = trackRef.current
    const firstCard = track?.querySelector<HTMLElement>(cardSelector)
    const loopStart =
      track?.querySelector<HTMLElement>("[data-loop-start='true']")

    if (track && firstCard && loopStart) {
      const loopWidth = loopStart.offsetLeft - firstCard.offsetLeft

      if (loopWidth > 0 && track.scrollLeft >= loopWidth) {
        track.scrollLeft -= loopWidth
        scrollPositionRef.current -= loopWidth
      }
    }
  }, [cardSelector])

  const slideByCard = (direction = 1) => {
    const track = trackRef.current
    const cards = track?.querySelectorAll<HTMLElement>(cardSelector)
    const loopStart =
      track?.querySelector<HTMLElement>("[data-loop-start='true']")

    if (!track || !cards || cards.length < 2 || !loopStart) return

    const distance = cards[1].offsetLeft - cards[0].offsetLeft

    if (direction < 0 && track.scrollLeft < distance) {
      const loopWidth = loopStart.offsetLeft - cards[0].offsetLeft
      track.scrollLeft += loopWidth
      scrollPositionRef.current = track.scrollLeft
    } else {
      normalizeLoop()
    }

    track.scrollBy({
      left: direction * distance,
      behavior: "smooth",
    })
  }

  const startMoving = () => {
    if (!clickedRef.current) {
      movingRef.current = true
    }
  }

  const stopByClick = () => {
    if (autoPlay) return

    clickedRef.current = true
    movingRef.current = false
  }

  const resetInteraction = () => {
    clickedRef.current = false
    movingRef.current = autoPlay
  }

  useEffect(() => {
    const track = trackRef.current
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    if (!track) return

    let frameId = 0
    let previousTime = performance.now()
    const movementSpeed = prefersReducedMotion
      ? Math.min(pixelsPerSecond, 5)
      : pixelsPerSecond

    movingRef.current = autoPlay
    scrollPositionRef.current = track.scrollLeft

    const handleVisibilityChange = () => {
      if (document.hidden) {
        movingRef.current = false
      } else if (!clickedRef.current) {
        movingRef.current = autoPlay
        previousTime = performance.now()
      }
    }

    const animate = (currentTime: number) => {
      const elapsed = Math.min(currentTime - previousTime, 50)
      previousTime = currentTime

      if (movingRef.current) {
        if (Math.abs(track.scrollLeft - scrollPositionRef.current) > 2) {
          scrollPositionRef.current = track.scrollLeft
        }

        scrollPositionRef.current += (movementSpeed * elapsed) / 1000
        track.scrollLeft = scrollPositionRef.current
        normalizeLoop()
      }

      frameId = requestAnimationFrame(animate)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    frameId = requestAnimationFrame(animate)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      cancelAnimationFrame(frameId)
    }
  }, [autoPlay, normalizeLoop, pixelsPerSecond])

  return {
    trackRef,
    slideByCard,
    trackEvents: {
      onMouseLeave: resetInteraction,
      onBlurCapture: resetInteraction,
    },
    cardEvents: {
      onMouseEnter: startMoving,
      onMouseMove: startMoving,
      onClick: stopByClick,
      onFocus: startMoving,
    },
  }
}
