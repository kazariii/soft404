import { useEffect, useState } from "react"

type OpeningState = "hidden" | "closed" | "opening"

function shouldShowOpening() {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches
  const hasOpened = sessionStorage.getItem("soft404-opened") === "true"

  return !reducedMotion && !hasOpened
}

function PageOpening() {
  const [shouldOpen] = useState(shouldShowOpening)
  const [state, setState] = useState<OpeningState>(
    shouldOpen ? "closed" : "hidden",
  )

  useEffect(() => {
    if (state === "hidden") {
      document.body.classList.remove("page-opening-active")
      return
    }

    document.body.classList.add("page-opening-active")
    return () => document.body.classList.remove("page-opening-active")
  }, [state])

  useEffect(() => {
    if (!shouldOpen) return

    const openTimer = window.setTimeout(() => {
      setState("opening")
      sessionStorage.setItem("soft404-opened", "true")
    }, 650)

    const removeTimer = window.setTimeout(() => {
      setState("hidden")
      document.body.classList.remove("page-opening-active")
    }, 2300)

    return () => {
      window.clearTimeout(openTimer)
      window.clearTimeout(removeTimer)
    }
  }, [shouldOpen])

  if (state === "hidden") return null

  return (
    <div
      className={`page-opening ${state === "opening" ? "is-opening" : ""}`}
      aria-hidden="true"
    >
      <div className="paper-panel paper-panel-left">
        <span className="paper-grain" />
      </div>
      <div className="paper-panel paper-panel-right">
        <span className="paper-grain" />
      </div>

      <div className="opening-mark">
        <span>soft</span>
        <strong>404</strong>
        <small>for the things the heart keeps</small>
      </div>

      <span className="paper-seam" />
    </div>
  )
}

export default PageOpening
