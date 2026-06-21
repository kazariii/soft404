import { spotifyPlaylists } from "../data/personalData"
import RightNowCard from "./RightNowCard"

function SpotifySection() {
  return (
    <section className="section section-brown" id="music">
      <div className="section-shell">
        <header className="section-header music-header">
          <p className="section-kicker section-kicker-light">02 — songs that understand</p>
          <h2>Melodies for words<br /><em>I never learned to say.</em></h2>
        </header>

        <RightNowCard />

        <div className="music-layout">
          <aside className="music-quote">
            <span className="quote-mark">“</span>
            <blockquote>
              Some songs arrive
              <br />
              where words cannot.
            </blockquote>
            <div className="vinyl" aria-hidden="true">
              <div className="vinyl-ring" />
              <div className="vinyl-label">soft<br />404</div>
            </div>
          </aside>

          <div className="playlist-stack">
            {spotifyPlaylists.map((playlist) => (
              <article className="playlist-card" key={playlist.title}>
                <div className="playlist-meta">
                  <div>
                    <p className="playlist-mood">{playlist.mood}</p>
                    <h3>{playlist.title}</h3>
                  </div>
                  <span className="playlist-index">PLAYLIST 001</span>
                </div>
                <p className="playlist-description">{playlist.description}</p>
                <iframe
                  title={playlist.title}
                  src={playlist.embedUrl}
                  width="100%"
                  height="352"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SpotifySection
