import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import {
  getRequiredSecret,
  hmacSha256,
  jsonResponse,
  timingSafeEqual,
} from "../_shared/spotify.ts"

Deno.serve(async (request) => {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get("code")
    const state = url.searchParams.get("state")

    if (!code || !state) {
      return jsonResponse({ error: "Spotify did not return an authorization code." }, 400)
    }

    const [timestamp, nonce, signature] = state.split(".")
    if (!timestamp || !nonce || !signature) {
      return jsonResponse({ error: "Invalid Spotify authorization state." }, 400)
    }

    if (Date.now() - Number(timestamp) > 10 * 60 * 1000) {
      return jsonResponse({ error: "Spotify authorization has expired." }, 400)
    }

    const unsignedState = `${timestamp}.${nonce}`
    const expectedSignature = await hmacSha256(
      unsignedState,
      getRequiredSecret("SPOTIFY_SETUP_KEY"),
    )

    if (!timingSafeEqual(signature, expectedSignature)) {
      return jsonResponse({ error: "Invalid Spotify authorization state." }, 400)
    }

    const clientId = getRequiredSecret("SPOTIFY_CLIENT_ID")
    const clientSecret = getRequiredSecret("SPOTIFY_CLIENT_SECRET")
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: getRequiredSecret("SPOTIFY_REDIRECT_URI"),
      }),
    })

    if (!tokenResponse.ok) {
      const spotifyError = await tokenResponse.text()
      console.error("Spotify token exchange failed", {
        status: tokenResponse.status,
        response: spotifyError,
      })

      let errorDescription = spotifyError
      try {
        const parsedError = JSON.parse(spotifyError) as {
          error?: string
          error_description?: string
        }
        errorDescription =
          parsedError.error_description ??
          parsedError.error ??
          "Spotify rejected the token exchange."
      } catch {
        // Spotify occasionally returns a plain-text error response.
      }

      return jsonResponse(
        {
          error: "Spotify token exchange failed.",
          reason: errorDescription,
          status: tokenResponse.status,
        },
        502,
      )
    }

    const tokenData = await tokenResponse.json() as {
      access_token: string
      refresh_token?: string
    }

    if (!tokenData.refresh_token) {
      return jsonResponse({ error: "Spotify did not provide a refresh token." }, 502)
    }

    const profileResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const profile = profileResponse.ok
      ? await profileResponse.json() as { id?: string }
      : {}

    const supabase = createClient(
      getRequiredSecret("SUPABASE_URL"),
      getRequiredSecret("SUPABASE_SERVICE_ROLE_KEY"),
    )
    const { error } = await supabase.from("spotify_tokens").upsert({
      id: "primary",
      refresh_token: tokenData.refresh_token,
      spotify_user_id: profile.id ?? null,
      updated_at: new Date().toISOString(),
    })

    if (error) throw error

    const siteUrl = getRequiredSecret("SITE_URL")
    return Response.redirect(`${siteUrl}?spotify=connected#music`, 302)
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Spotify callback failed." },
      500,
    )
  }
})
