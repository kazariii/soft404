import { photos } from "../data/personalData"

function PhotoGallery() {
  return (
    <section className="section section-gallery" id="photos">
      <div className="section-shell">
        <header className="section-header gallery-header">
          <div>
            <p className="section-kicker">05 — light, briefly held</p>
            <h2>Proof that even passing<br /><em>moments can stay.</em></h2>
          </div>
          <p className="section-description">
            Fleeting light, quiet places, and the small beauty I almost walked
            past without noticing.
          </p>
        </header>

        <div className="photo-grid">
          {photos.map((photo, index) => (
            <figure className={`photo-item photo-item-${index + 1}`} key={photo.src}>
              <img src={photo.src} alt={photo.caption} />
              <figcaption>
                <span>{photo.location}</span>
                <p>{photo.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PhotoGallery
