# Appointment Module — Frontend

Single-page application for the appointment booking platform. Built with **React 19**, **Vite**, **TypeScript** and **Tailwind CSS**, with role-based routing for **customers**, **staff** and **admins**.

> Pairs with the [appointment_module_backend](../appointment_module_backend) Laravel API.

## Tech Stack

- React 19
- Vite 8
- TypeScript
- Tailwind CSS 4
- React Router 8
- TanStack Query 5
- Axios
- ESLint

## Features

- Role-based authentication & routing
  - `customer` — browse services, book & cancel appointments, manage profile
  - `staff` — view assigned appointments, update status, manage profile
  - `admin` — manage categories, services, staff and all appointments
- Token-based auth stored in `localStorage`
- Automatic 401 handling — logs the user out and redirects to `/login`
- Data fetching & caching via React Query
- Protected routes by role (`RoleRoutes` + `ProtectedRoute`)

## Requirements

- Node.js **18+** (Node **20+** recommended)
- npm
- A running instance of the [backend API](../appointment_module_backend)

## Installation

```bash
npm install
```

## Configuration

The API base URL is defined in [`src/api/index.ts`](src/api/index.ts):

```ts
const api = axios.create({
  baseURL: "http://appointment_module_backend.test/api",
});
```

Update it to match your local backend (e.g. `http://localhost:8000/api`) if you're not using Laravel Valet / Herd's `*.test` domain.

The auth token is read from `localStorage` under the key `token`, and the user's role under `role`.

## Running the app

```bash
# Start dev server (Vite, hot reload)
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview

# Lint
npm run lint
```

Default Vite URL: <http://localhost:5173>

## Project Structure

```
src/
├── api/                # Axios instance + endpoint wrappers
│   ├── index.ts
│   ├── auth.ts
│   ├── appointments.ts
│   ├── categories.ts
│   ├── services.ts
│   ├── staff.ts
│   └── profiles.ts
├── contexts/
│   └── auth/           # AuthContext, AuthProvider, useAuth
├── hooks/
├── pages/
│   ├── admin/          # Admin pages
│   ├── customer/       # Customer pages
│   ├── staff/          # Staff pages
│   ├── shared/         # Shared pages (login, etc.)
│   ├── components/
│   └── layouts/
├── routes/
│   ├── adminRoutes.tsx
│   ├── customerRoutes.tsx
│   ├── staffRoutes.tsx
│   └── RoleRoutes.tsx
├── other/              # ProtectedRoute, types, helpers
├── App.tsx
├── main.tsx
└── index.css
```

## Available Scripts

| Script            | Description                   |
| ----------------- | ----------------------------- |
| `npm run dev`     | Start Vite dev server         |
| `npm run build`   | Type-check (`tsc -b`) + build |
| `npm run preview` | Preview the production build  |
| `npm run lint`    | Run ESLint                    |

## License

MIT
