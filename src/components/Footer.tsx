import { socialLinks } from "../data/personalData"

function Footer() {
  return (
    <footer id="footer">
      <div className="footer-shell">
        <p className="section-kicker section-kicker-light">until our paths cross again</p>
        <div className="footer-main">
          <h2>Find me where<br /><em>the story continues.</em></h2>
          <div className="footer-side">
            <p>
              The archive ends here, but I am still leaving pieces of myself
              elsewhere—through songs, photographs, thoughts, and unfinished dreams.
            </p>
            <div className="social-links">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.url} target="_blank" rel="noreferrer">
                  {link.label}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <a className="wordmark wordmark-light" href="#top">soft<span>404</span></a>
          <p>Made from quiet nights, tender memories, and a heart that keeps everything.</p>
          <p>© {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
