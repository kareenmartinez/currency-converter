# Currency Converter

A single-screen currency converter built with React and TypeScript. It fetches currencies and exchange rates from an API, lets the user pick an amount and a currency pair, and displays the converted result with loading and error states.

---

## A note on scope (and why it looks like a bigger app)

This is intentionally a **one-page app**. I know that for something this small you could use fewer libraries, less configuration, and a flatter folder structure — and that would be perfectly valid.

I still chose this setup because, in my day-to-day work, I usually build **larger applications**. I wanted to share how I think, how I like to structure code, and how I would approach a feature even when the UI is small. Some layers here are a bit more ceremony than strictly necessary for a single screen; that is a conscious trade-off, not an oversight.

In a bigger codebase I would lean more heavily into **feature-based modules** (each feature owning its UI, hooks, and types). Here the split is lighter — mostly one feature folder — but the **ideas** (page vs feature, hooks vs utils, services vs UI) are the same ones I use on larger projects.

I would also add **automated testing** (unit tests for `utils/`, hook tests with React Query test utils, and a few integration tests for the main flow). That is not implemented yet in this repo, but it is part of how I would harden this in a real team environment.

---

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
# Install dependencies
npm install

# Copy environment file and set the API base URL
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=https://your-api-base-url
```

The app expects two endpoints relative to that base URL:

- `GET /currencies`
- `GET /rates?base={currencyCode}`

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (Vite) |
| `npm run build` | Type-check and production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

CI (`.github/workflows/ci.yml`) runs `lint` and `build` on push/PR.

---

## Architecture

### Folder structure

```text
src/
├── main.tsx                 # App bootstrap (providers, router)
├── routes/                  # React Router config
├── pages/
│   └── ConverterPage.tsx    # Orchestration: data, loading, layout
├── features/converter/
│   └── ConverterFeature.tsx # Presentational UI for the converter
├── hooks/
│   ├── useCurrencies.ts     # Fetch + expose currency list state
│   ├── useRates.ts          # Fetch + expose rates state for a base currency
│   └── useConverter.ts      # Form state (amount, from, to, options)
├── services/
│   └── converter.ts         # HTTP calls (axios)
├── utils/
│   ├── convert.ts           # Pure conversion logic (buildConversionResult)
│   └── format.ts            # Number/date parsing and formatting
├── components/              # Shared, generic UI (inputs, errors, loading)
└── config/                  # env, axios client, React Query client
└── assets/icons/          # SVG icon components
```

### How responsibility is split

| Layer | Role |
|---|---|
| **Page** | Wires hooks together, handles page-level loading/errors, owns the purple/white layout shell, passes props to the feature |
| **Feature** | Renders the converter UI (hero, form, rates block). No direct API calls |
| **Hooks** | Server state (`useCurrencies`, `useRates`) and client form state (`useConverter`) |
| **Services** | Thin HTTP layer — knows endpoints, not React |
| **Utils** | Pure functions — conversion math, formatting, no side effects |
| **Components** | Reusable UI primitives used across the app |

### Data flow

```text
API
  ↓
services/converter.ts
  ↓
useCurrencies / useRates / useConverter
  ↓
ConverterPage (combines everything, buildConversionResult)
  ↓
ConverterFeature (renders)
```

**`ConverterPage`** is the container:

1. Loads currencies → shows loading/error or continues
2. Runs form state via `useConverter(currencies)`
3. Loads rates for the selected “from” currency via `useRates`
4. Builds `result` with `buildConversionResult` (amount × rate, labels, inverse rate text)
5. Passes everything to **`ConverterFeature`**

**`ConverterFeature`** is presentational: hero title, form fields, rates section (loading spinner, error with retry, or conversion result).

**`buildConversionResult`** (in `utils/convert.ts`) takes raw inputs and returns one object ready for display — so the UI does not repeat business rules.


---

## Tech stack and decisions

### Vite

I chose **Vite** as the build tool because it gives fast dev feedback (ESM + HMR), a simple config for a SPA, and a straightforward production build. For a project this size, Create React App would be heavier than needed; Vite stays minimal while still supporting TypeScript, path aliases (`@/`), and the Tailwind plugin out of the box.

**Trade-off:** Vite is excellent for SPAs; if this grew into a multi-app monorepo or needed SSR, I would reconsider (e.g. Next.js, etc).

### TypeScript

Strict typing for API responses, hook return shapes, and conversion results. Catches mistakes at build time and documents contracts between layers.


### React Router DOM

The app has **one route** (`/`). Router is not strictly required here.

I still included it because:

- It matches how I structure apps that will grow (layout route, error boundaries per route, lazy-loaded pages)
- `AppLayout` wraps the page with a shared header
- Route-level `errorElement` handles unexpected render errors

**Trade-off:** Extra dependency and a few files for a single screen.

### TanStack React Query

Honestly, for **two GET requests** you could use `useEffect` and `useState` and call it a day. I still went with React Query.

Why: this app fetches currencies once and rates every time you change the "from" currency — loading, error, retry, and cache are already part of the UI. React Query gives me that without writing it by hand in each hook. The defaults live in `config/queryClient.ts`, and `useCurrencies` / `useRates` stay small.

It's more than this screen strictly needs. I picked it because it's what I use when an app talks to an API for real, and I wanted this challenge to reflect that. If the project grew — more endpoints, refetch on focus, shared data between pages — I wouldn't have to swap tools.

### Axios

Same idea: **`fetch` would work here.** There are only two endpoints.

I used axios because I set up a shared client in `config/httpClient.ts` (base URL from env, one place for all requests). The actual calls sit in `services/converter.ts`. That's the pattern I follow on bigger projects — when you later need auth headers, interceptors, or consistent error handling, you change one file, not every request.

For this challenge it's a bit of upfront structure. I accepted that on purpose, as part of the "base that could scale" I mentioned above.

### Tailwind CSS v4

You could style this with plain CSS or CSS modules — one screen, not a lot of components. I still used **Tailwind**.

Why: it's what I'm fastest with day to day. I didn't want the challenge to be about writing custom CSS files; I wanted to focus on layout, responsiveness, and structure. Shared values (brand color, spacing, breakpoints) live in `index.css`, and I added a few semantic classes (`.hero-title`, `.rates-section`) where the same styles repeat.

The markup can look busy with utility classes — that's the trade-off. For me it's worth it: quick iterations, easy `max-md:` tweaks for mobile, and no pile of separate stylesheets for a small app.

### react-error-boundary

This one is tiny. There's already error handling for the API (loading states, retry buttons, React Router `errorElement`). **react-error-boundary** is for something different: when React itself crashes while rendering — a bug in a component, not a failed fetch.

Wrapping the app in `main.tsx` means the user sees an error message instead of a blank screen. Strictly optional for a challenge this size. I added it because I usually put it at the root of real projects — it's a small habit, not a big dependency.


---


## What I would do differently at scale

| This project | Larger product |
|---|---|
| One feature folder | Multiple features under `features/`, each with components, hooks, types |
| Page orchestrates one feature | Pages compose several features or use route loaders |
| Props passed into `ConverterFeature` | Possibly colocated feature hooks, or grouped props (`form`, `rates`) |
| No tests yet | Vitest + Testing Library for utils, hooks, and critical UI flows |
| Inline React Query keys | Centralized query keys if many queries and invalidation rules |

---

## How to read the code (suggested order)

1. `src/main.tsx` — providers and router entry
2. `src/pages/ConverterPage.tsx` — where data comes together
3. `src/hooks/useCurrencies.ts`, `useRates.ts`, `useConverter.ts` — state and fetching
4. `src/utils/convert.ts` — conversion result builder
5. `src/features/converter/ConverterFeature.tsx` — UI

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Base URL for the currency API |

See `.env.example`.
