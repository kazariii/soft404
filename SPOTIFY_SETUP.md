# Spotify Right Now setup

## 1. Spotify Dashboard

Open your app in https://developer.spotify.com/dashboard and add this exact
Redirect URI:

```text
https://jhsdttlbikkukkdvzzut.supabase.co/functions/v1/spotify-callback
```

Copy the app's **Client ID** and **Client Secret**. Never add the Client Secret
to a `VITE_` environment variable or frontend file.

## 2. Create the token table

Open **Supabase → SQL Editor**, paste the contents of `supabase/spotify.sql`,
and run it.

## 3. Add Edge Function secrets

Open **Supabase → Edge Functions → Secrets** and add:

```text
SPOTIFY_CLIENT_ID=your Spotify Client ID
SPOTIFY_CLIENT_SECRET=your Spotify Client Secret
SPOTIFY_REDIRECT_URI=https://jhsdttlbikkukkdvzzut.supabase.co/functions/v1/spotify-callback
SPOTIFY_SETUP_KEY=a long random private value
SITE_URL=http://localhost:5173
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided automatically to
deployed Supabase Edge Functions.

Generate a setup key in PowerShell:

```powershell
[guid]::NewGuid().ToString() + [guid]::NewGuid().ToString()
```

## 4. Deploy the functions

From the project directory:

```bash
npx supabase login
npx supabase link --project-ref jhsdttlbikkukkdvzzut
npx supabase functions deploy spotify-auth
npx supabase functions deploy spotify-callback
npx supabase functions deploy spotify-now
```

## 5. Authorize your Spotify account once

Open this URL in your browser, replacing `YOUR_SETUP_KEY` with the secret from
step 3:

```text
https://jhsdttlbikkukkdvzzut.supabase.co/functions/v1/spotify-auth?setup_key=YOUR_SETUP_KEY
```

Log in with the Spotify account whose music should appear on the website and
approve the requested permissions.

After authorization, Spotify redirects back to the website and stores only the
refresh token in the protected `spotify_tokens` table.

## 6. Production deployment

When the website is published, change the `SITE_URL` Edge Function secret to
the production HTTPS URL. The Spotify Redirect URI remains the Supabase
callback URL above.
