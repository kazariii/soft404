# Anonymous notes setup

1. Create a project at https://supabase.com/dashboard.
2. Open **SQL Editor**, paste the contents of
   `supabase/anonymous_notes.sql`, then run it.
3. Open **Project Settings → API** and copy:
   - Project URL
   - Publishable/anon key
4. Add them to `.env`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

5. Restart the development server.

## Managing notes

- Open **Table Editor → anonymous_notes**.
- Private submissions are only visible there.
- Public submissions appear immediately.
- Delete unwanted submissions directly from the table.

Never place the Supabase `service_role` key in this frontend project.
