import { useEffect, useState } from "react"
import { useSpotifyNow } from "../hooks/useSpotifyNow"

function formatTime(milliseconds = 0) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = String(totalSeconds % 60).padStart(2, "0")
  return `${minutes}:${seconds}`
}

function RightNowCard() {
  const { status, track } = useSpotifyNow()
  const [clock, setClock] = useState(() => Date.now())

  useEffect(() => {
    if (!track?.isPlaying) return

    const interval = window.setInterval(() => {
      setClock(Date.now())
    }, 1000)

    return () => window.clearInterval(interval)
  }, [track])

  const elapsedSinceFetch =
    track?.isPlaying && track.fetchedAt ? clock - track.fetchedAt : 0
  const progress = Math.min(
    (track?.progressMs ?? 0) + elapsedSinceFetch,
    track?.durationMs ?? Number.POSITIVE_INFINITY,
  )
  const progressPercent =
    track?.durationMs && track.durationMs > 0
      ? Math.min((progress / track.durationMs) * 100, 100)
      : 0

  if (status === "loading") {
    return (
      <article className="right-now-card is-loading">
        <div className="right-now-artwork" />
        <div className="right-now-copy">
          <p className="right-now-label">right now</p>
          <h3>Listening for a melody...</h3>
          <p>The song is still making its way here.</p>
        </div>
      </article>
    )
  }

  if (!track?.configured || !track.title) {
    return (
      <article className="right-now-card is-quiet">
        <div className="right-now-artwork right-now-placeholder">
          <span>♪</span>
        </div>
        <div className="right-now-copy">
          <p className="right-now-label">right now</p>
          <h3>The room is quiet.</h3>
          <p>No song is playing, but the silence has its own rhythm.</p>
        </div>
      </article>
    )
  }

  return (
    <article className="right-now-card">
      <a
        className="right-now-artwork"
        href={track.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${track.title} on Spotify`}
      >
        {track.artwork ? (
          <img src={track.artwork} alt={`${track.album} album cover`} />
        ) : (
          <span>♪</span>
        )}
        <span className={`playing-bars ${track.isPlaying ? "is-playing" : ""}`}>
          <i />
          <i />
          <i />
        </span>
      </a>

      <div className="right-now-copy">
        <p className="right-now-label">
          <span className={track.isPlaying ? "is-live" : ""} />
          {track.isPlaying ? "playing right now" : "last heard"}
        </p>
        <h3>{track.title}</h3>
        <p className="right-now-artist">{track.artist}</p>
        <p className="right-now-album">{track.album}</p>

        <div className="track-progress" aria-hidden="true">
          <span style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="track-times">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(track.durationMs)}</span>
        </div>
      </div>
    </article>
  )
}

export default RightNowCard
