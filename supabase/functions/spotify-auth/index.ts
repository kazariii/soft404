import {
  getRequiredSecret,
  hmacSha256,
  jsonResponse,
  timingSafeEqual,
} from "../_shared/spotify.ts"

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok")

  try {
    const url = new URL(request.url)
    const suppliedKey = url.searchParams.get("setup_key") ?? ""
    const setupKey = getRequiredSecret("SPOTIFY_SETUP_KEY")

    if (!timingSafeEqual(suppliedKey, setupKey)) {
      return jsonResponse({ error: "Unauthorized setup request." }, 401)
    }

    const timestamp = Date.now().toString()
    const nonce = crypto.randomUUID()
    const unsignedState = `${timestamp}.${nonce}`
    const signature = await hmacSha256(unsignedState, setupKey)
    const state = `${unsignedState}.${signature}`

    const authorizeUrl = new URL("https://accounts.spotify.com/authorize")
    authorizeUrl.search = new URLSearchParams({
      client_id: getRequiredSecret("SPOTIFY_CLIENT_ID"),
      response_type: "code",
      redirect_uri: getRequiredSecret("SPOTIFY_REDIRECT_URI"),
      scope: "user-read-currently-playing user-read-recently-played",
      state,
      show_dialog: "true",
    }).toString()

    return Response.redirect(authorizeUrl.toString(), 302)
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Spotify setup failed." },
      500,
    )
  }
})
