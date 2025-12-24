## Secret Santa · Winter Night

A cinematic, cozy Secret Santa web experience for private clubs (≈50 people) built with **Next.js App Router**, **React**, **Tailwind CSS**, and **Firebase Firestore**.  
No logins, emails, or accounts—identity is verified only by **group + name + secret code**.

### Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS, Framer Motion
- **3D Hero**: Spline (via `@splinetool/react-spline`, placeholder URL included)
- **Backend**: Firebase Admin SDK + Firestore
- **Hosting**: Vercel-ready

### Firestore Schema

- `groups` (collection)
  - `<groupId>` (document, e.g. `psychmic`)
    - `members` (map)
      - `Jay`
        - `code`: `"JY82K"`
        - `assignedTo`: `"Aadya"`
        - `revealed`: `false`
      - `Aadya`
        - `code`: `"AD91Q"`
        - `assignedTo`: `"Ravi"`
        - `revealed`: `true`

Assignments are generated once on the server using a derangement algorithm and stored permanently. They are **never regenerated** from the frontend.

### Environment Variables

Create a `.env.local` file with:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-admin-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Admin key for organizer-only group creation
ADMIN_SETUP_KEY=some-long-random-secret
```

> Note: For Windows/PowerShell, keep the `\n` in the private key string. They are converted to real newlines in code.

### Running Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

### Admin: Creating a Group and Assignments

1. Visit `/admin` (only organizers should know this URL).
2. Enter:
   - **Admin Key** – must match `ADMIN_SETUP_KEY` (checked server-side only).
   - **Group ID** – e.g. `psychmic`.
   - **Member Names** – one name per line.
3. Submit:
   - The server generates a **derangement** so no one is assigned to themselves.
   - Each member gets a unique `code` and `assignedTo`.
   - `revealed` is initialized to `false`.

You can view the generated document directly in Firestore if you need to share codes with members.

### Member Flow (No Login)

1. Member opens `/`:
   - Sees winter-night hero with Spline 3D, snowfall, and dimmed scene.
2. Scrolls (or clicks “Begin your reveal”) to **Identify Yourself**:
   - Selects **group** (populated from Firestore, names only).
   - Selects **their name** (only unrevealed members in that group).
   - Enters **their secret code**.
3. On submit:
   - Frontend calls the `/api/reveal` endpoint.
   - Backend validates `group + name + code`.
   - If valid, returns only **their `assignedTo`** and sets `revealed = true`.
4. The cinematic **envelope reveal** scene opens:
   - Envelope with wax seal.
   - Letter slides out with: “You are gifting to… AADYA”.

### Security Model

- **No authentication system**: identity = `group + name + code`.
- Backend:
  - Validates all input.
  - Returns a single `assignedTo` only.
  - Never exposes full group data or codes.
  - `members` map only leaves the server as:
    - Group IDs list (`/api/groups`).
    - Member names where `revealed = false` (`/api/members`).
- Frontend:
  - Never stores assignments permanently.
  - Never generates randomness.
  - Never contains secret codes.

### Spline Integration

The hero uses a placeholder Spline scene URL. Replace it with your own:

```tsx
// components/Hero.tsx
<Spline scene="https://prod.spline.design/your-scene-id/scene.splinecode" />
```

Keep motion subtle to fit the calm winter-night mood.


