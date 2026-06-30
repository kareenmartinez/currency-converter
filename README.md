# Currency Converter

Single-screen currency converter built with React and TypeScript. Fetches currencies and exchange rates from an API, lets the user pick an amount and a currency pair, and shows the converted result with loading and error states.

---

## A note on scope

This is a **one-page app**. If I were shipping something this small to production, I'd probably use fewer layers and a flatter structure — and that would be fine for the actual scope.

I structured it this way because **I usually work on larger applications**. For this challenge I wanted to share **how I think and organize code** when a project needs to grow — not to argue that this stack is the best choice for a single screen. Some of the structure here is more ceremony than this UI strictly needs; that's intentional.

The main idea is **feature ownership**: the converter owns its UI, hooks, types, and domain logic. A page only renders `<ConverterFeature />` — no wiring, no props.

---

## Getting started

**Prerequisites:** Node.js 20+, npm

```bash
npm install
cp .env.example .env   # set VITE_API_URL
```

Endpoints (relative to `VITE_API_URL`):

- `GET /currencies`
- `GET /rates?base={currencyCode}`

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Dev server (Vite)                  |
| `npm run build`   | Type-check + production build      |
| `npm run preview` | Preview production build           |
| `npm run lint`    | ESLint                             |

CI (`.github/workflows/ci.yml`) runs `lint` and `build` on push/PR.

---

## Architecture

### Folder structure

```
src/
├── main.tsx                          # Providers, router, error boundary
├── routes/                           # React Router config
├── pages/
│   └── ConverterPage.tsx             # Layout shell → <ConverterFeature />
├── features/converter/
│   ├── ConverterFeature.tsx          # Container / public entry
│   ├── conversion.ts                 # Pure conversion logic
│   ├── types.ts                      # Domain types, ConverterForm, hasAmount
│   ├── hooks/
│   │   ├── useConverter.ts           # Form state (amount, from/to, options)
│   │   ├── useCurrencies.ts          # React Query: currency list
│   │   └── useRates.ts               # React Query: rates for base currency
│   └── components/
│       ├── ConverterView.tsx         # Form UI; calls controller when currencies are ready
│       └── ConversionResultView.tsx  # Rates block: RQ flags + conversion result
├── services/converter.ts             # HTTP calls (axios)
├── components/                       # Shared UI (inputs, select, errors, loading)
├── config/                           # env, http client, React Query client
└── utils/format.ts                   # Number/date formatting, parsing
```

**Rule:** anything that knows what a *currency* or a *rate* is lives in `features/converter/`. Generic UI and helpers live in `components/` and `utils/`. Features depend on shared code, never the other way around.

### Layers

| Layer | Role |
| ----- | ---- |
| **Page** | Layout shell only. Renders `<ConverterFeature />`. |
| **Feature (container)** | `useCurrencies` (React Query) — gates loading / error / success. |
| **View** | Receives `currencyList` (API data); calls `useConverter` and renders the form. |
| **ConversionResultView** | `useRates` — loading / error / conversion result. |
| **Hooks** | Server state (`useCurrencies`, `useRates`) and form state (`useConverter`). |
| **Services** | Thin HTTP layer — endpoints, not React. |
| **Domain** | `conversion.ts` and `types.ts` — pure logic and types. |

### Data flow

```
API → services/converter.ts → useCurrencies → ConverterFeature
  → ConverterView → useConverter + ConversionResultView (useRates)
```

### State and async UI

Both server fetches use **React Query** thin wrappers (`useCurrencies`, `useRates`). Keep the query result as a named object — `currencies.isPending`, `rates.data` — instead of destructuring flags. Pass resolved data to children with a distinct prop name (e.g. `currencyList={currencies.data}`).

Form state follows the same idea: `useConverter(...).form`.

---

## Tech stack and decisions

### Vite + TypeScript

Vite for fast dev feedback and a minimal SPA setup. TypeScript strict mode for API shapes, hook return types, and domain guards like `hasAmount`.

### TanStack React Query

Two GET requests could live in `useEffect` + `useState`. I used React Query because loading, error, retry, and cache are already part of the UI, and it's what I reach for on real API-driven apps.

`useRates` uses `keepPreviousData`. **`rates.data?.base !== fromCurrency`** keeps loading visible until rates for the newly selected base arrive.

### Axios

`fetch` would work. Axios gives a shared client in `config/httpClient.ts` (base URL from env, normalized error messages, cancellation passthrough). Calls live in `services/converter.ts` — one place to add auth or interceptors later.

### Native `<select>` for currencies

The currency picker is a native `<select>` (`SelectField`), styled with Tailwind and progressive `appearance: base-select` rules in `index.css` where the browser supports them. For ~30 options without search, native is accessible by default and keeps the implementation small.

### Amount input

`useConverter` keeps `amountDraft` (what the user typed) separate from `amount` (parsed via `parseNumber`). The input is `type="text"` with `inputMode="decimal"` because `type="number"` clears in-progress values like `"1."`, which breaks decimal entry. Invalid characters are rejected with a simple pattern before updating state.

### Currency pair guard

Each selector disables the currency already chosen on the other side (`fromOptions` / `toOptions`), so the user can't pick the same code twice.

### Tailwind CSS v4

Utility-first styling to move fast on layout and responsiveness. Repeated patterns (`.field-control`, `.rate-line`, `.hero-title`) live in `index.css` so JSX stays readable.

### react-error-boundary

API errors are handled with loading states, inline errors, and retry buttons. The error boundary (in `main.tsx`) covers a different case: an uncaught render crash, so the user sees a message instead of a blank screen.

### React Router

Router is wired even for a single page — same bootstrap pattern I'd use when routes grow. `ConverterPage` stays a thin layout shell.

---

## What I'd revisit in production

These are conscious gaps, not oversights.

**Default currencies** — `fromCurrency` / `toCurrency` default to `"USD"` / `"EUR"` without checking the API response. In production I'd align with backend/product: either the API returns a sorted list with sensible defaults (or a dedicated "popular pairs" field), or the client treats `"USD"` / `"EUR"` as preferences and falls back when the list loads if they're missing. Depends on who owns that contract and how stable the currency set is.

**Tests** — not in this repo yet. `conversion.ts`, `format.ts`, and `hasAmount` are pure and easy to unit-test; `useConverter` has real logic (amount validation, disabled options). I'd add Vitest + Testing Library for the main flow.

**Persistence** — state resets on reload. Storing amount + pair in `localStorage` would be a small, useful addition.

**Design questions** — hero title copy (codes + names), whether the inverse rate line matches expectations, and `last updated`: the API returns a date only (`"2026-06-25"`), so showing a time would be misleading without a backend timestamp.

**At scale** — more folders under `features/`, centralized React Query keys.

---

## Where to start reading

1. `src/features/converter/ConverterFeature.tsx`
2. `src/features/converter/hooks/useConverter.ts`
3. `src/features/converter/types.ts`
4. `src/features/converter/components/ConverterView.tsx`

---

## Environment

| Variable       | Required | Description            |
| -------------- | -------- | ---------------------- |
| `VITE_API_URL` | Yes      | Currency API base URL  |

See `.env.example`.
