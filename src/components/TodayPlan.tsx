import { todayPlan } from "../data/personalData"
import { useGoogleCalendar } from "../hooks/useGoogleCalendar"

function TodayPlan() {
  const { events, error, isConfigured, status } = useGoogleCalendar()
  const calendarLoaded = status === "success"
  const displayedItems = calendarLoaded
    ? events
    : todayPlan.map((item, index) => ({
        ...item,
        id: `static-${index}`,
      }))

  return (
    <section className="section section-cream" id="today">
      <div className="section-shell">
        <header className="section-header split-header">
          <div>
            <p className="section-kicker">01 — the shape of today</p>
            <h2>
              Where today chooses <em>to carry me.</em>
            </h2>
          </div>

          <div className="calendar-intro">
            <p className="section-description">
              A small window into the hours ahead—plans, pauses, and places
              where this day may leave its mark.
            </p>

            {status === "loading" && (
              <p className="calendar-sync-status">
                <span className="calendar-status-dot is-loading" />
                gathering today&apos;s hours
              </p>
            )}

            {calendarLoaded && (
              <p className="calendar-sync-status">
                <span className="calendar-status-dot" />
                unfolding now · Asia/Jakarta
              </p>
            )}

            {status === "error" && (
              <p className="calendar-error">
                {error}
                {isConfigured && " A remembered rhythm is shown instead."}
              </p>
            )}
          </div>
        </header>

        <div className="timeline">
          {calendarLoaded && displayedItems.length === 0 ? (
            <div className="calendar-empty">
              <span>✦</span>
              <h3>Today asks for nothing.</h3>
              <p>An open page, waiting to become whatever it needs to be.</p>
            </div>
          ) : (
            displayedItems.map((item, index) => (
              <article className="timeline-item" key={item.id}>
                <span className="timeline-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="timeline-time">{item.time}</p>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
                <span className="timeline-mark timeline-mark-static" aria-hidden="true">
                  ✦
                </span>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default TodayPlan
