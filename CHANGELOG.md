# Changelog

All notable changes to the Appointment Module frontend.

## Phase 5 — Contract alignment

- `AuthProvider` rehydrate path now uses the typed `profiles.get(role)` helper instead of a raw `fetch()`. Previously a hard refresh left `user === undefined` and pages that branched on `user?.person` rendered an "İletişim bilgileri yüklenemedi." placeholder until a separate profile query fired.
- `setAuthConsumer` replaces `window.dispatchEvent("auth:logout")`. The `api/interceptors` 401 handler calls a real React callback (registered at app startup). `useLogoutMutation` now calls `handleLogout()` directly through context instead of dispatching events.
- Hard schema rename: `catagory_id` → `category_id` across all types, forms, and payload objects. Added `src/utils/ids.ts` with `toIdKey`/`toIdNumber` helpers so cache keys and bodies are deterministic.
- Removed the dual service-scope → category-scope staff lookup in `BookAppointmentPage` and `MyAppointmentDetailPage`. Service-scoped staff is authoritative after the rename.
- `Login.tsx` collapses the two competing `useEffect`/`useNavigate` flows into one branch keyed by a `useRef` so React re-renders can't double-navigate.
- `AdminStaffEdit.tsx` (plus `AdminServiceEdit`, `AdminCategoryEdit`) capture `isError` so 500/404 surface the real error message instead of "loading".

## Phase 6 — TS strict + UX hardening

- `tsconfig.app.json` enables full `strict` mode (`strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `useUnknownInCatchVariables`, `noUncheckedIndexedAccess`, …).
- Top-level `AppErrorBoundary` in `src/App.tsx` recovers from any render-time exception with a "Tekrar Dene" CTA.
- `netlify.toml` adds CSP, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy` for camera/microphone/geolocation via a SPA-wide `[[headers]]` block.

## Phase 8 — CI

- `.github/workflows/web-ci.yml` runs ESLint (`--max-warnings 0`), `tsc -b --noEmit`, and the production build on every push/PR to `main`.
