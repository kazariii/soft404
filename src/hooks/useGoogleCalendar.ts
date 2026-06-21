import { useEffect, useState } from "react"

const CALENDAR_TIME_ZONE = "Asia/Jakarta"

type CalendarApiEvent = {
  id: string
  summary?: string
  description?: string
  location?: string
  start: {
    date?: string
    dateTime?: string
  }
}

export type CalendarEvent = {
  id: string
  time: string
  title: string
  detail: string
}

type CalendarStatus = "loading" | "success" | "error"

function getJakartaDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: CALENDAR_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  )
}

function getTodayRange() {
  const { year, month, day } = getJakartaDateParts()
  const start = new Date(`${year}-${month}-${day}T00:00:00+07:00`)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)

  return {
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
  }
}

function formatEventTime(event: CalendarApiEvent) {
  if (!event.start.dateTime) return "all day"

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: CALENDAR_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(event.start.dateTime))
}

export function useGoogleCalendar() {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
  const calendarId = import.meta.env.VITE_GOOGLE_CALENDAR_ID
  const isConfigured = Boolean(apiKey && calendarId)

  const [status, setStatus] = useState<CalendarStatus>(
    isConfigured ? "loading" : "error",
  )
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [error, setError] = useState(
    isConfigured
      ? ""
      : "Today’s hours are resting beyond reach.",
  )

  useEffect(() => {
    if (!isConfigured) return

    const controller = new AbortController()
    const { timeMin, timeMax } = getTodayRange()
    const params = new URLSearchParams({
      key: apiKey ?? "",
      timeMin,
      timeMax,
      timeZone: CALENDAR_TIME_ZONE,
      singleEvents: "true",
      orderBy: "startTime",
      showDeleted: "false",
      maxResults: "20",
    })

    const loadEvents = async () => {
      try {
        const encodedCalendarId = encodeURIComponent(calendarId ?? "")
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodedCalendarId}/events?${params}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Today’s path could not be found."
              : "Today’s hours could not make their way here.",
          )
        }

        const data = (await response.json()) as { items?: CalendarApiEvent[] }
        const mappedEvents = (data.items ?? []).map((event) => ({
          id: event.id,
          time: formatEventTime(event),
          title: event.summary || "a quiet, private hour",
          detail:
            event.location ||
            event.description ||
            (event.summary
              ? "A small promise waiting somewhere in today."
              : "The details of this hour are being kept quietly."),
        }))

        setEvents(mappedEvents)
        setStatus("success")
        setError("")
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === "AbortError") {
          return
        }

        setStatus("error")
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Today’s hours could not make their way here.",
        )
      }
    }

    void loadEvents()
    return () => controller.abort()
  }, [apiKey, calendarId, isConfigured])

  return {
    events,
    error,
    isConfigured,
    status,
  }
}
