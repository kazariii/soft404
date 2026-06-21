import { books } from "../data/personalData"
import { useInfiniteCarousel } from "../hooks/useInfiniteCarousel"

function ReadingCorner() {
  const { trackRef, slideByCard, trackEvents, cardEvents } =
    useInfiniteCarousel(".book-card", 9)

  const renderBooks = (duplicate = false) =>
    books.map((book, index) => (
      <article
        className="book-card"
        key={`${duplicate ? "duplicate" : "original"}-${book.title}`}
        data-loop-start={duplicate && index === 0 ? "true" : undefined}
        aria-hidden={duplicate || undefined}
        {...cardEvents}
      >
        <div className="book-cover-wrap">
          <span className="book-index">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="book-status">{book.status}</span>
          <img
            className="book-cover"
            src={book.image}
            alt={duplicate ? "" : `Book cover for ${book.title}`}
          />
        </div>
        <div className="book-card-copy">
          <p className="book-author">by {book.author}</p>
          <h3>{book.title}</h3>
          <p className="book-note">“{book.note}”</p>
        </div>
      </article>
    ))

  return (
    <section className="section section-paper" id="reading">
      <div className="section-shell">
        <header className="section-header split-header">
          <div>
            <p className="section-kicker">04 — between the pages</p>
            <h2>Books that left<br /><em>their words in me.</em></h2>
          </div>
          <div className="section-header-side">
            <p className="section-description">
              Some books are closed and returned to the shelf. Others remain
              open inside us, quietly rewriting who we are.
            </p>
            <div className="carousel-controls">
              <button
                type="button"
                onClick={() => slideByCard(-1)}
                aria-label="Previous books"
              >
                ←
              </button>
              <span>turn through the shelf</span>
              <button
                type="button"
                onClick={() => slideByCard(1)}
                aria-label="Next books"
              >
                →
              </button>
            </div>
          </div>
        </header>

        <div
          className="book-list carousel-track"
          ref={trackRef}
          {...trackEvents}
        >
          {renderBooks()}
          {renderBooks(true)}
        </div>
      </div>
    </section>
  )
}

export default ReadingCorner
