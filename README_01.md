# Airport Gap Dashboard --- Learning Notes

A step-by-step React project for practising modern frontend architecture
using a real REST API. This README is a learning journal: use it to
refresh the reasoning behind the code, not just to copy implementation
details.

## 1. Project goals

Build a company-style dashboard while learning:

-   React 19, TypeScript, Vite, React Router 7, Axios and Tailwind CSS
    v4
-   Context API, `useReducer`, custom hooks, `useCallback`, `useMemo`,
    and HOCs
-   Authentication, protected routes, API services, loading/error states
-   Reusable tables, search, sorting, server-side pagination, and
    dynamic routes

**Learning principle:** build one feature at a time, understand its data
flow, verify it, and then move forward.

## 2. Setup and scripts

``` bash
npm create vite@latest airport-gap-dashboard -- --template react-ts
cd airport-gap-dashboard
npm install
npm install react-router@7 axios
npm install tailwindcss @tailwindcss/vite
npm run dev
```

Useful checks:

``` bash
npm run lint
npm run build
```

Tailwind v4 is integrated through the Vite plugin.

`vite.config.ts`:

``` ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

`src/index.css`:

``` css
@import "tailwindcss";

* {
  box-sizing: border-box;
}

html,
body,
#root {
  min-height: 100%;
  margin: 0;
}

body {
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}
```

## 3. Folder structure and responsibilities

``` text
src/
├── assets/
├── components/
│   ├── common/       # Reusable components, e.g. DataTable
│   ├── forms/        # Shared form components
│   ├── layout/       # Header, Sidebar, Footer
│   └── ui/           # Small UI building blocks
├── config/           # App configuration
├── context/          # AuthContext and AuthProvider
├── hooks/            # useAuth, useAirports, reusable React logic
├── hoc/              # withAuth
├── layouts/          # MainLayout
├── pages/
│   ├── auth/         # LoginPage
│   ├── dashboard/    # DashboardPage
│   ├── airports/     # AirportsPage, AirportDetailsPage
│   ├── favorites/    # FavoritesPage
│   └── reports/      # ReportsPage
├── reducers/         # authReducer and other reducers
├── routes/           # AppRoutes
├── services/
│   ├── api/          # Shared Axios client
│   ├── auth/         # Authentication requests
│   └── airport/      # Airport API functions and mapping
├── types/            # Shared TypeScript types
├── utils/            # Storage and reusable utilities
├── App.tsx
├── main.tsx
└── index.css
```

Not every planned folder needs code yet. Add files when a feature needs
them.

  Layer              Responsibility
  ------------------ -----------------------------------------------------------
  Page               Assembles page UI and page-specific interactions
  Component          Renders reusable UI
  Hook               Packages reusable React state and behavior
  Service            Communicates with the API and maps API data
  Type/interface     Describes a data contract
  Context/provider   Shares state with descendant components
  Reducer            Defines predictable state transitions
  Utility            Holds reusable functions not tied to a specific component

## 4. App and routing

`main.tsx` wraps the app with `BrowserRouter` and `AuthProvider`, making
routing and authentication available throughout the component tree.

``` text
main.tsx
└── BrowserRouter
    └── AuthProvider
        └── App
            └── AppRoutes
                ├── /login
                └── protected route group
                    └── MainLayout
                        ├── Header
                        ├── Sidebar
                        ├── Outlet (active page)
                        └── Footer
```

Routes implemented:

-   `/login`
-   `/dashboard`
-   `/airports`
-   `/airports/:id`
-   `/favorites`
-   `/reports`

`Outlet` renders the matched nested route inside `MainLayout`.

## 5. Authentication architecture

Key files:

-   `context/AuthContext.ts`
-   `context/AuthProvider.tsx`
-   `hooks/useAuth.ts`
-   `reducers/authReducer.ts`
-   `types/auth.ts`
-   `utils/storage.ts`
-   `services/auth/authService.ts`
-   `services/api/axiosClient.ts`
-   `hoc/withAuth.tsx`
-   `pages/auth/LoginPage.tsx`

### Login data flow

``` text
LoginPage
  ↓ login(credentials)
AuthProvider
  ↓ authService.login()
axiosClient → POST /tokens
  ↓ token response
storage.setToken(token)
  ↓ dispatch(LOGIN)
AuthContext updates
  ↓
Protected route renders
```

-   `AuthContext.ts` defines the context and its value type.
-   `AuthProvider.tsx` owns authentication state and exposes
    `login`/`logout`.
-   `authReducer` handles `LOGIN` and `LOGOUT` actions.
-   `useAuth()` provides a consistent way to consume the context and
    throws a clear error outside the provider.
-   `withAuth` checks authentication and redirects unauthenticated users
    to `/login`.
-   Router state stores the original requested location, so login can
    return the user to that path; otherwise it falls back to
    `/dashboard`.
-   `useNavigate()` performs navigation from handlers; `<Navigate />`
    redirects during rendering.
-   `replace: true` replaces the current history entry.

The current learning implementation stores the token in `localStorage`
under `airport_gap_token` and attaches it as a Bearer token through the
Axios request interceptor. Browser storage has security trade-offs;
production authentication should follow the backend's recommended
approach and threat model.

## 6. Environment variables

The `.env` file belongs in the **project root**, alongside
`package.json`, not inside `src/`.

`.env`:

``` env
VITE_API_BASE_URL=https://airportgap.com/api
```

`.env.example`:

``` env
VITE_API_BASE_URL=
```

Vite exposes client-side variables prefixed with `VITE_` through
`import.meta.env`. Restart the dev server after changing `.env`.

**Never put secrets or private API keys in a `VITE_` variable:** these
values are included in the client bundle.

## 7. Axios client and API services

`services/api/axiosClient.ts` creates a shared Axios instance with the
base URL and common headers. Its request interceptor attaches the stored
token if one exists.

Benefits:

-   Avoid repeating the base URL.
-   Centralize common headers and request behavior.
-   Keep service functions focused on individual API operations.

The login service posts form-encoded credentials to `/tokens`, using
`application/x-www-form-urlencoded`.

### Airport response shape

The API returns each airport with fields nested under `attributes`:

``` text
data[]
├── id
├── type
└── attributes
    ├── name
    ├── city
    ├── country
    ├── iata
    ├── icao
    ├── latitude (string in API response)
    ├── longitude (string in API response)
    ├── altitude
    └── timezone
```

The airport service maps the raw response to the application's
normalized `Airport` model. It flattens `attributes` and converts
latitude and longitude to numbers.

This means UI code can use `airport.name` and `airport.latitude` instead
of repeatedly knowing about `airport.attributes.name` and string
coordinates.

### Why distinguish API types from application types?

-   `AirportApiItem` describes the raw server response.
-   `Airport` describes the normalized data used by the UI.
-   `AirportsResponse` describes the list response, including pagination
    links.
-   `AirportPage` describes normalized airport data plus pagination
    metadata.

Use `string | null` for fields that may be null, and display a fallback
such as `—` where appropriate.

## 8. `useAirports` custom hook

`hooks/useAirports.ts` owns airport fetching and pagination state. It
does not render UI.

It currently manages:

-   `airports`
-   `page`, `totalPages`
-   `nextPage`, `previousPage`
-   `isLoading`, `error`
-   `goToPage(page)`
-   `refetch()`

### Data flow

``` text
AirportsPage
  ↓ useAirports()
useAirports
  ↓ getAirports(page)
airportService
  ↓ Axios GET /airports?page=N
Airport Gap API
  ↓ response data + links
service maps response
  ↓
hook updates state
  ↓
AirportsPage re-renders
```

The effect runs when the selected page or refresh key changes. Its
cleanup uses an `ignore` flag to prevent an outdated request from
updating state after cleanup. This flag does not cancel the HTTP request
itself.

`useCallback` is used for `goToPage` and `refetch` so their function
identity can remain stable while dependencies are unchanged. Use
memoization where useful, not automatically for every function.

Loading/error states should be explicit: loading indicator, success
content, readable error, and retry/refresh action.

## 9. Server-side pagination

The Airport Gap list response includes `next`, `prev`, and `last` links.
The `last` link indicates the final page.

The service requests a page using Axios query parameters:

``` ts
axiosClient.get('/airports', {
  params: { page },
})
```

For page 2, Axios sends `/airports?page=2`.

-   **Server-side pagination:** the server returns one requested page.
    This is what the airport list uses.
-   **Client-side pagination:** the browser downloads all records and
    splits them into pages. This is not the approach used here.

The UI should use the API's returned pagination metadata. Disable
Previous when `previousPage` is `null`, and Next when `nextPage` is
`null`.

## 10. Search and sorting

Search and sorting live in `AirportsPage.tsx`, not `useAirports.ts`.

In our verified implementation, the API documents pagination but does
not document search/sort query parameters. Therefore search and sorting
currently apply only to the airports loaded for the selected server
page.

The page's `useMemo` derives the displayed array from:

-   `airports`
-   `search`
-   `sortField`
-   `sortDirection`

`filter()` narrows the records. `sort()` orders the filtered array.
Because `filter()` returns a new array, sorting it does not mutate the
original React state array.

`useMemo` is a performance optimization, not a requirement for
correctness.

## 11. Reusable `DataTable`

`components/common/DataTable.tsx` is a generic table component. It
receives:

-   `columns`: column headers and cell render functions
-   `data`: rows to display
-   `rowKey`: a stable unique key for each row

`AirportsPage` supplies airport-specific columns. `DataTable` handles
shared table markup and styling.

A generic component can later render users, reports, or other data
without duplicating table structure. The reusable table should not
contain airport-specific API logic.

## 12. Dynamic airport details route

Step 9 added:

-   `getAirportById(id)` in the airport service
-   `pages/airports/AirportDetailsPage.tsx`
-   route `/airports/:id`
-   a link from the airport name to its details URL

Data flow:

``` text
User clicks airport name
  ↓
Link navigates to /airports/GKA
  ↓
React Router matches /airports/:id
  ↓
useParams() returns id = "GKA"
  ↓
getAirportById("GKA")
  ↓
service maps API response
  ↓
AirportDetailsPage renders the details
```

`useParams()` reads the URL parameter. The details page manages loading,
error, and success states. The Back to airports link uses client-side
navigation.

## 13. Coding style and conventions

1.  Use descriptive names: `getAirportById`, `isLoading`,
    `previousPage`.
2.  Keep API calls in services, not inside reusable UI components.
3.  Define meaningful TypeScript types; avoid `any` when a useful type
    is possible.
4.  Treat caught errors as `unknown` and narrow them before accessing
    properties.
5.  Handle nullable API fields with explicit fallbacks.
6.  Use stable React keys, such as the airport's unique ID.
7.  Call hooks only at the top level of components or custom hooks---not
    inside conditions, loops, or nested callbacks.
8.  Keep effect dependencies correct; don't suppress warnings without
    understanding them.
9.  Use `useMemo` and `useCallback` when justified, not as decoration.
10. Normalize API responses in the service layer when their shape
    differs from the application model.
11. Never put secrets in frontend `VITE_` variables.
12. Give inputs labels; use buttons for actions and links for
    navigation.
13. Run `npm run lint` and `npm run build` after changes.
14. Test loading, success, errors, refresh, navigation, and boundary
    conditions.

### React Hooks lint note

Investigate a warning about synchronously setting state inside an effect
rather than blindly disabling it. Keep effects responsible for
synchronizing with external systems and update state when asynchronous
results resolve. If a rule still flags the code, check the installed
React Hooks ESLint plugin version and exact diagnostic before changing
the architecture.

## 14. Progress tracker

These steps are marked complete based on the project's reported working
state. Re-test a feature after refactoring it.

-   [x] Step 1 --- Vite React + TypeScript setup
-   [x] Step 2 --- Folder structure, layout, and navigation
-   [x] Step 3 --- Login and authentication state
-   [x] Step 4 --- Protected routes and post-login redirect
-   [x] Step 5 --- Airport API, service, and custom hook
-   [x] Step 6 --- Reusable generic `DataTable`
-   [x] Step 7 --- Server-side pagination
-   [x] Step 8 --- Current-page search and sorting
-   [x] Step 9 --- Dynamic airport details route

## 15. Quick debugging checklist

### API URL is undefined or wrong

-   Check `.env` is at project root.
-   Check the exact name `VITE_API_BASE_URL`.
-   Restart Vite after editing `.env`.
-   Inspect the actual URL in the browser Network tab.

### Airport properties are undefined

-   Inspect the actual API response.
-   Remember the raw fields are under `attributes`.
-   Check the service maps them to the `Airport` model.
-   The API uses `iata`, `icao`, and `city`, not `iata_code` or
    `municipality`.

### `toFixed()` fails

-   Confirm the service converts coordinates with `Number(...)`.
-   Confirm the `Airport` model types coordinates as numbers.

### Pagination fails

-   Inspect the `page` query parameter in Network tools.
-   Check `links.next`, `links.prev`, and `links.last`.
-   Check how links without a `page` parameter are handled.
-   Confirm the hook updates page state and fetches the new page.

### Details page fails

-   Confirm `/airports/:id` is inside the protected route group.
-   Check the airport link uses the correct ID.
-   Verify the endpoint and single-airport response shape.
-   Inspect the Network response and console.

### Login redirect fails

-   Check the `from` location in router state.
-   Confirm fallback to `/dashboard`.
-   Confirm `AuthProvider` wraps the route tree.

## 16. Workflow for every new feature

1.  Define the user-facing requirement.
2.  Inspect the API endpoint and actual response.
3.  Define the API response type.
4.  Implement/update the service.
5.  Normalize the response if needed.
6.  Add a custom hook if reusable stateful logic is needed.
7.  Build the UI.
8.  Add loading, error, empty, and success states.
9.  Run lint and build.
10. Test manually and update this README.

## 17. Next planned feature --- Step 10: Favorites

Before implementation, inspect the actual Airport Gap favorites
endpoints and response shapes. Do not assume endpoint names or request
bodies.

Potential learning topics:

-   Favorite/unfavorite API operations
-   Authentication headers
-   Service functions for mutations
-   Loading and error states during mutations
-   Updating the UI after a mutation
-   Empty states and retry behavior

## Final reminder

When brushing up, ask yourself:

-   Where does this data come from?
-   Which layer owns this behavior?
-   Is this raw API data or normalized application data?
-   What triggers a re-render or API request?
-   What happens when a request fails?
-   What happens when the user changes pages or navigates away?
-   Can this UI be reused without adding airport-specific logic to it?

Understanding these answers is more important than memorizing the code.
