# Velvet Shell — Auth setup (Supabase + Resend)

We use **Supabase Auth directly** (not Prisma). Supabase owns passwords, sessions, and RLS; Postgres holds `profiles` + OTP rows. Prisma would only add an ORM for SQL — it does not make auth stronger.

## What was built

| Area | Behavior |
|------|----------|
| Customer register | Full name, email, phone, password → Supabase user + `profiles` row |
| Customer login | Email **or** phone + password |
| Forgot password | 6-digit code emailed via **Resend**, hashed in `password_reset_codes`, deleted after success; auto sign-in |
| Account password change | Re-checks current password, then updates via service role |
| Admin login | Supabase password check + `profiles.role = 'admin'` → signed admin cookie |

Admin credentials are **not** hardcoded in the repo. You put them in `.env.local` and run the seed script once.

---

## Your checklist (do these in order)

### 1. Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) → New project.
2. Note the region; save the database password somewhere safe.
3. Open **Project Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`  
     (**never** expose this in the browser or commit it)

### 2. Run SQL migrations (automated — no paste)

1. Supabase → **Project Settings → Database** → copy **Database password**  
   (or reset it if you lost it)
2. Put it in root `.env.local` as `SUPABASE_DB_PASSWORD=...`
3. From the repo:

```bash
npm run db:migrate
```

That applies every file in `supabase/migrations/` and tracks what’s already applied.  
You should not need the SQL Editor for schema changes after this.

### 3. Auth settings (seamless UX)

In Supabase → **Authentication → Providers → Email**:

- Enable Email provider.
- For launch, turn **off** “Confirm email” (we auto-confirm on register so shoppers are not blocked). You can turn confirmation on later.

Optional: Authentication → URL Configuration → Site URL = `http://localhost:3000` (and your production domain later).

### 4. Env files

**Storefront** — copy `.env.example` → `.env.local` at the repo root and fill values:

```bash
copy .env.example .env.local
```

Set at least:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` (for seed only)
- `ADMIN_SESSION_SECRET` (long random string)
- `RESEND_API_KEY` + `RESEND_FROM_EMAIL` (for forgot-password emails)
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- `AUTH_OTP_PEPPER` (any long random string)

**Admin app** — copy `admin/.env.example` → `admin/.env.local` with the **same** Supabase URL/keys and `ADMIN_SESSION_SECRET`.

### 5. Seed the admin user

From the repo root (with `.env.local` filled):

```bash
npm run seed:admin
```

This creates/updates the Auth user and sets `profiles.role = 'admin'`.

Use the email/password you put in `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env.local` only (never commit them). Then open **http://localhost:3001/login** and sign in.

### 6. Resend (forgot password)

1. Create an account at [https://resend.com](https://resend.com).
2. Create an API key → `RESEND_API_KEY`.
3. Until you verify a domain, use `RESEND_FROM_EMAIL=Velvet Shell <onboarding@resend.dev>` and send only to **your own** Resend account email.
4. For production: verify `velvetshell.com` (or your domain) in Resend and set `RESEND_FROM_EMAIL` to something like `Velvet Shell <hello@yourdomain.com>`.

Without Resend in production, forgot-password will error. In local/dev without a key, the OTP is printed to the **server console** so you can still test.

### 7. Run the apps

```bash
npm run dev          # storefront :3000 — /account
npm run admin:dev    # admin :3001 — /login
```

### 8. Smoke test

1. Register a shopper on `/account` (full name, email, phone, password).
2. Log out → sign in with **email** + password.
3. Log out → sign in with **phone** + same password.
4. Forgot password → check email (or server log) → enter code → new password → landed signed in.
5. Admin: `/login` on port 3001 with the seeded admin only (a normal customer must get “no admin access”).

---

## Security notes

- Passwords live only in Supabase Auth (hashed). We never store plaintext passwords in `localStorage`.
- Reset codes are stored as **SHA-256 hashes** with a server pepper; rows are deleted after a successful reset.
- Rate limits apply on login / register / forgot / reset.
- `SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_PASSWORD` must stay server-side only.

## Next (commerce)

Auth is ready. Next pages to wire against the same Supabase schema: products/inventory sync, checkout → `orders` / Razorpay, wishlist, admin catalog/orders UI.
