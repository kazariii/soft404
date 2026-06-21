import { films } from "../data/personalData"
import { useInfiniteCarousel } from "../hooks/useInfiniteCarousel"

function CinemaCorner() {
  const { trackRef, slideByCard, trackEvents, cardEvents } =
    useInfiniteCarousel(".film-card", 18, true)

  const renderFilms = (duplicate = false) =>
    films.map((film, index) => (
      <article
        className="film-card"
        key={`${duplicate ? "duplicate" : "original"}-${film.title}`}
        data-loop-start={duplicate && index === 0 ? "true" : undefined}
        aria-hidden={duplicate || undefined}
        {...cardEvents}
      >
        <div className="film-poster-wrap">
          <img
            className="film-poster"
            src={film.image}
            alt={duplicate ? "" : `Poster for ${film.title}`}
          />
          <div className="film-topline">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span>{film.year}</span>
          </div>
        </div>
        <div className="film-body">
          <p className="film-mood">{film.mood}</p>
          <h3>{film.title}</h3>
          <p className="film-note">“{film.note}”</p>
        </div>
        <div className="film-rating" aria-label={`${film.rating} rating`}>
          {film.rating}
        </div>
      </article>
    ))

  return (
    <section className="section section-ink" id="cinema">
      <div className="section-shell">
        <header className="section-header split-header">
          <div>
            <p className="section-kicker section-kicker-light">03 — stories in motion</p>
            <h2>Films that followed me<br /><em>home from the dark.</em></h2>
          </div>
          <div className="section-header-side">
            <p className="section-description section-description-light">
              Stories that ended on the screen, yet kept unfolding somewhere
              quietly inside me.
            </p>
            <div className="carousel-controls carousel-controls-light">
              <button
                type="button"
                onClick={() => slideByCard(-1)}
                aria-label="Previous films"
              >
                ←
              </button>
              <span>drift through the stories</span>
              <button
                type="button"
                onClick={() => slideByCard(1)}
                aria-label="Next films"
              >
                →
              </button>
            </div>
          </div>
        </header>

        <div
          className="film-grid carousel-track"
          ref={trackRef}
          {...trackEvents}
        >
          {renderFilms()}
          {renderFilms(true)}
        </div>
      </div>
    </section>
  )
}

export default CinemaCorner
