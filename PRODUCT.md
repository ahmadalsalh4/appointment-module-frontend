# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three roles share equal importance; none outranks the others:

- **Customer** — browses available services, selects a staff member and time slot, and books appointments. Manages their own appointments (view, filter, cancel).
- **Staff/provider** — views assigned appointments, filters by customer/date/status, and updates appointment status through the workflow (pending → confirmed → completed, or cancelled).
- **Admin/owner** — configures the system: CRUD for services, categories, and staff members. Oversees all appointments across the business. Dashboard with key stats.

Primary audience is Turkish-speaking local businesses and their customers. The system is designed to be general-purpose across appointment-based business types (wellness, professional services, medical, educational, etc.).

## Product Purpose

A self-hosted appointment management system that lets local businesses accept online bookings and manage their schedule. Success means a business owner can set up services and staff, customers can discover and book available slots, and staff can manage their daily schedule — all in Turkish, without depending on a third-party SaaS subscription.

## Positioning

Built specifically for Turkish-speaking local businesses. Unlike global appointment tools (Calendly, SimplyBook, etc.), this is tailored to local expectations: Turkish-first interface, self-hosted deployment the business controls, and a three-role model (customer/staff/admin) that mirrors how small local businesses actually operate — where the owner needs full oversight, the staff need a focused schedule view, and customers need a simple booking flow.

## Operating Context

- Workflow: Admin configures services/categories/staff → customer registers and books → staff manages incoming appointments → admin monitors via dashboard.
- Environment: Web browser on desktop and mobile. Responsive sidebar layout (collapses to FAB drawer on mobile).
- Backend: Laravel 13 API (`appointment_module_backend`), separate repo.
- Language: Turkish — all UI copy, labels, and messages are in Turkish. No i18n framework.
- Deployment: Self-hosted by the business, not a managed SaaS.

## Capabilities and Constraints

**Confirmed functionality:**
- Three-role authentication (customer, staff, admin) with role selection at login
- Service catalog with categories, browsable by customers
- Real-time availability checking by staff member and date
- Appointment booking with staff and time-slot selection
- Appointment lifecycle: pending → confirmed → completed (or cancelled)
- Full CRUD for services, categories, and staff members (admin only)
- Admin dashboard with aggregate stats (staff count, category count, pending appointments, active customers)
- Dark/light theme toggle, persisted to localStorage
- Responsive layout (sidebar on desktop, FAB drawer on mobile)

**Technical stack:**
- React 19, Vite 8, TypeScript 6, Tailwind CSS v4
- TanStack Query for server state, Axios for HTTP, React Router v8 for routing
- Custom CSS theme tokens (7 semantic colors + dark-mode overrides) via Tailwind `@theme`
- No third-party UI component library — all components are hand-built

**Constraints:**
- Laravel backend is fixed; frontend must conform to existing API shapes (including known backend typos like `catagory_id`)
- Turkish-only at this stage; no localization requirement from the client
- No binding constraints from the client beyond what has been built

**Open decisions:**
- Final product name and brand identity (current "Randevu Sistemi" is a placeholder)
- Production hosting and domain

## Brand Commitments

- **Developer credit**: "Ahmad Alsaleh" appears in footer and auth page copyright notices. This may be replaced when the client adopts the product.
- **No established brand identity**: "Randevu Sistemi" is a placeholder name. No client-provided logo, color palette, or visual identity exists. The current favicon is a generic purple lightning-bolt icon.

## Evidence on Hand

- Working codebase with full API integration — all features are backed by real endpoints, not mock data
- Test accounts documented in README (admin, 6 staff by category, 3 customers)
- Built artifacts in `dist/` confirm production-readiness
- No real customer data, testimonials, case studies, or press coverage exist; future work must not fabricate these
- No client-provided assets (logo, brand guide, photography) exist

## Product Principles

1. **Every role is a first-class user.** Customer, staff, and admin each get a dedicated workspace tailored to their job — never a watered-down view of someone else's interface.

2. **Self-hosted independence.** The business owns its data and deployment. No vendor lock-in, no subscription dependency, no third-party branding.

3. **Local-first, not translated.** Turkish is the design language, not a translation layer over an English product. Terminology, flows, and conventions match local expectations.

4. **Simplicity over enterprise complexity.** Small businesses don't need Salesforce-level configurability. Defaults are sensible, workflows are linear, and every feature justifies its presence.

5. **API reality over API fantasy.** The frontend ships against the real backend, not an idealized spec. Known quirks (like backend typos) are accommodated rather than fought.

## Accessibility & Inclusion

- `<html lang="tr">` is correctly set for Turkish screen readers
- Semantic HTML used throughout (headings, landmarks, labels, table structure)
- Focus rings present on interactive elements
- `color-scheme: dark` set for native browser UI adaptation in dark mode
- No formal WCAG conformance target has been established by the client
- No screen-reader testing has been performed; complex widgets (sidebar drawer) lack ARIA roles and focus trapping
