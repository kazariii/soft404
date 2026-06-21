import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import {
  corsHeaders,
  getRequiredSecret,
  jsonResponse,
  refreshSpotifyAccessToken,
} from "../_shared/spotify.ts"

type SpotifyTrack = {
  name: string
  duration_ms: number
  artists: Array<{ name: string }>
  album: {
    name: string
    images: Array<{ url: string }>
  }
  external_urls: {
    spotify: string
  }
}

function mapTrack(
  track: SpotifyTrack,
  isPlaying: boolean,
  progressMs = 0,
) {
  return {
    isPlaying,
    title: track.name,
    artist: track.artists.map((artist) => artist.name).join(", "),
    album: track.album.name,
    artwork: track.album.images[0]?.url ?? null,
    url: track.external_urls.spotify,
    progressMs,
    durationMs: track.duration_ms,
  }
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      getRequiredSecret("SUPABASE_URL"),
      getRequiredSecret("SUPABASE_SERVICE_ROLE_KEY"),
    )
    const { data: tokenRow, error } = await supabase
      .from("spotify_tokens")
      .select("refresh_token")
      .eq("id", "primary")
      .single()

    if (error || !tokenRow) {
      return jsonResponse({ configured: false, isPlaying: false })
    }

    const tokenData = await refreshSpotifyAccessToken(tokenRow.refresh_token)

    if (tokenData.refresh_token) {
      await supabase
        .from("spotify_tokens")
        .update({
          refresh_token: tokenData.refresh_token,
          updated_at: new Date().toISOString(),
        })
        .eq("id", "primary")
    }

    const authorization = {
      Authorization: `Bearer ${tokenData.access_token}`,
    }
    const playingResponse = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      { headers: authorization },
    )

    if (playingResponse.status === 200) {
      const playing = await playingResponse.json() as {
        is_playing: boolean
        progress_ms?: number
        item?: SpotifyTrack
      }

      if (playing.item) {
        return jsonResponse({
          configured: true,
          ...mapTrack(
            playing.item,
            playing.is_playing,
            playing.progress_ms ?? 0,
          ),
        })
      }
    }

    const recentResponse = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      { headers: authorization },
    )

    if (recentResponse.ok) {
      const recent = await recentResponse.json() as {
        items?: Array<{ track: SpotifyTrack; played_at: string }>
      }
      const lastItem = recent.items?.[0]

      if (lastItem) {
        return jsonResponse({
          configured: true,
          ...mapTrack(lastItem.track, false),
          playedAt: lastItem.played_at,
        })
      }
    }

    return jsonResponse({ configured: true, isPlaying: false, track: null })
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Spotify is unavailable." },
      500,
    )
  }
})
