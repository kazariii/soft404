import { useEffect, useState } from "react"

export type SpotifyNow = {
  configured: boolean
  isPlaying: boolean
  title?: string
  artist?: string
  album?: string
  artwork?: string | null
  url?: string
  progressMs?: number
  durationMs?: number
  playedAt?: string
  fetchedAt?: number
}

type SpotifyStatus = "loading" | "ready" | "unavailable"

export function useSpotifyNow() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const [track, setTrack] = useState<SpotifyNow | null>(null)
  const [status, setStatus] = useState<SpotifyStatus>(
    supabaseUrl ? "loading" : "unavailable",
  )

  useEffect(() => {
    if (!supabaseUrl) return

    const controller = new AbortController()

    const loadTrack = async () => {
      try {
        const response = await fetch(
          `${supabaseUrl}/functions/v1/spotify-now`,
          { signal: controller.signal },
        )
        if (!response.ok) throw new Error("Spotify status could not be loaded.")

        setTrack({
          ...(await response.json()) as SpotifyNow,
          fetchedAt: Date.now(),
        })
        setStatus("ready")
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
        setStatus("unavailable")
      }
    }

    void loadTrack()
    const interval = window.setInterval(loadTrack, 15_000)

    return () => {
      controller.abort()
      window.clearInterval(interval)
    }
  }, [supabaseUrl])

  return { status, track }
}
