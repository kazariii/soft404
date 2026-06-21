import { useEffect, useState } from "react"
import type { FormEvent } from "react"

type Visibility = "public" | "private"

type PublicNote = {
  id: string
  author_name: string | null
  message: string
  created_at: string
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey)

const requestHeaders = {
  apikey: supabaseAnonKey ?? "",
  Authorization: `Bearer ${supabaseAnonKey ?? ""}`,
}

function formatNoteDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

function AnonymousNotes() {
  const [notes, setNotes] = useState<PublicNote[]>([])
  const [authorName, setAuthorName] = useState("")
  const [message, setMessage] = useState("")
  const [visibility, setVisibility] = useState<Visibility>("public")
  const [website, setWebsite] = useState("")
  const [status, setStatus] = useState<
    "idle" | "loading" | "submitting" | "success" | "error"
  >(isConfigured ? "loading" : "error")
  const [feedback, setFeedback] = useState(
    isConfigured ? "" : "The postbox is resting for a little while.",
  )

  useEffect(() => {
    if (!isConfigured) return

    const controller = new AbortController()

    const loadNotes = async () => {
      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/anonymous_notes?select=id,author_name,message,created_at&visibility=eq.public&approved=eq.true&order=created_at.desc&limit=12`,
          {
            headers: requestHeaders,
            signal: controller.signal,
          },
        )

        if (!response.ok) throw new Error("The postcards could not be gathered.")

        setNotes((await response.json()) as PublicNote[])
        setStatus("idle")
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
        setStatus("error")
        setFeedback("The postcards are taking a little longer to arrive.")
      }
    }

    void loadNotes()
    return () => controller.abort()
  }, [])

  const submitNote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isConfigured || status === "submitting") return
    if (website) return

    const trimmedMessage = message.trim()
    if (trimmedMessage.length < 3) {
      setStatus("error")
      setFeedback("Leave at least a few words before sending it away.")
      return
    }

    setStatus("submitting")
    setFeedback("")

    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/anonymous_notes`,
        {
          method: "POST",
          headers: {
            ...requestHeaders,
            "Content-Type": "application/json",
            Prefer: visibility === "public"
              ? "return=representation"
              : "return=minimal",
          },
          body: JSON.stringify({
            author_name: authorName.trim() || null,
            message: trimmedMessage,
            visibility,
            approved: visibility === "public",
          }),
        },
      )

      if (!response.ok) throw new Error("Your postcard could not begin its journey.")

      if (visibility === "public") {
        const [createdNote] = (await response.json()) as PublicNote[]
        if (createdNote) {
          setNotes((currentNotes) => [createdNote, ...currentNotes].slice(0, 12))
        }
      }

      setAuthorName("")
      setMessage("")
      setStatus("success")
      setFeedback(
        visibility === "public"
          ? "Your words have found a place on the public wall."
          : "Your words were folded safely and sent only to Kazari.",
      )
    } catch {
      setStatus("error")
      setFeedback("The postcard lost its way. Please try sending it once more.")
    }
  }

  return (
    <section className="section notes-section" id="notes">
      <div className="section-shell">
        <header className="section-header split-header notes-header">
          <div>
            <p className="section-kicker">06 — words without a face</p>
            <h2>
              Leave what your heart
              <br />
              <em>has carried too long.</em>
            </h2>
          </div>
          <p className="section-description">
            Send a thought without needing to name yourself. Let it rest on
            this public wall, or fold it quietly into a letter meant only for me.
          </p>
        </header>

        <div className="notes-layout">
          <form className="note-form" onSubmit={submitNote}>
            <div className="note-form-heading">
              <span>a postcard from nowhere</span>
              <span>soft404 · carried gently</span>
            </div>

            <div className="postcard-body">
              <div className="postcard-message">
                <p className="postcard-salutation">To whoever finds these words,</p>
                <label className="note-field note-message-field">
                  <span className="sr-only">Your note</span>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    maxLength={500}
                    minLength={3}
                    placeholder="leave the words you could not carry any farther..."
                    required
                  />
                  <small className="note-count">{message.length}/500</small>
                </label>
                <p className="postcard-signoff">with all that remained unsaid,</p>
              </div>

              <div className="postcard-address">
                <div className="postcard-stamp" aria-hidden="true">
                  <span>soft</span>
                  <strong>404</strong>
                  <small>post</small>
                </div>
                <span className="postcard-cancel-mark" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>

                <label className="note-field postcard-name">
                  <span>Signed by <small>only if you wish</small></span>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(event) => setAuthorName(event.target.value)}
                    maxLength={40}
                    placeholder="anonymous"
                    autoComplete="off"
                  />
                </label>

                <div className="postcard-lines" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="note-visibility">
                  <p>Let these words be</p>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        checked={visibility === "public"}
                        onChange={() => setVisibility("public")}
                      />
                      <span>
                        <strong>Public</strong>
                        left for anyone who needs them
                      </span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="visibility"
                        value="private"
                        checked={visibility === "private"}
                        onChange={() => setVisibility("private")}
                      />
                      <span>
                        <strong>Private</strong>
                        folded quietly for Kazari
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <label className="note-honeypot" aria-hidden="true">
              Website
              <input
                type="text"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </label>

            <button
              className="note-submit"
              type="submit"
              disabled={!isConfigured || status === "submitting"}
            >
              {status === "submitting" ? "letting it go..." : "send these words away"}
              <span aria-hidden="true">→</span>
            </button>

            {feedback && (
              <p
                className={`note-feedback ${status === "error" ? "is-error" : ""}`}
                role="status"
              >
                {feedback}
              </p>
            )}
          </form>

          <div className="public-notes">
            <div className="public-notes-heading">
              <div>
                <p className="section-kicker">postcards left behind</p>
                <h3>Words from people I may never meet</h3>
              </div>
              <span>{notes.length.toString().padStart(2, "0")}</span>
            </div>

            {status === "loading" ? (
              <p className="notes-state">listening for words on their way...</p>
            ) : notes.length > 0 ? (
              <div className="notes-grid">
                {notes.map((note) => (
                  <article className="public-note-card" key={note.id}>
                    <span className="public-note-mark">“</span>
                    <p>{note.message}</p>
                    <footer>
                      <span>{note.author_name || "anonymous"}</span>
                      <time dateTime={note.created_at}>
                        {formatNoteDate(note.created_at)}
                      </time>
                    </footer>
                  </article>
                ))}
              </div>
            ) : (
              <div className="notes-empty">
                <span>✦</span>
                <p>The wall is still quiet. Perhaps your words are meant to arrive first.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AnonymousNotes
