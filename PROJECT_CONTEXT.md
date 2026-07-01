****
****CURRENT STATUS CHECKPOINT
****
Date: 2026-07-01
Reviewed By: Development Team
Status: Architecture validated, backend schema complete, frontend source NOT YET CREATED

---

# DUCKYJOB FRONTEND ARCHITECTURE HANDOFF DOCUMENT

## PROJECT STATUS

This document reflects the complete project state after architecture review on 2026-07-01.

The project is currently in **Phase 4: Backend integration implementation (IN PROGRESS)**.

Database schema is **COMPLETE** (`backend/init.sql` — 16 tables, all migrations included).

**CRITICAL BLOCKER:** Frontend source code (`src/`) does NOT exist. Only configuration files present.

Backend controllers and models NOT YET IMPLEMENTED.

---

# PROJECT OVERVIEW

## Product Name

**DuckyJob**

## Product Type

Multi-tenant Recruitment Platform / Hiring SaaS

Comparable products:

* LinkedIn Jobs
* Glassdoor
* Wellfound
* Lever
* Greenhouse
* Ashby
* Levels.fyi

---

# CURRENT TECHNICAL STATE

## Repository Structure (as of 2026-07-01)

```text
UF2175_TA02_Proyecto_Estructura/
│
├── Frontend/                          (empty placeholder)
├── backend/
│   ├── src/
│   │   ├── app.js                     (MINIMAL: basic express setup)
│   │   ├── config/                    (EMPTY - not implemented)
│   │   ├── controllers/               (EMPTY - CRITICAL BLOCKER)
│   │   ├── models/                    (EMPTY - CRITICAL BLOCKER)
│   │   ├── routes/                    (EMPTY - CRITICAL BLOCKER)
│   │   ├── package.json
│   │   └── .env                       (PostgreSQL connection string)
│   ├── init.sql                       (COMPLETE - 16 tables with seed data)
│   ├── docker-compose.yml             (PostgreSQL container defined)
│   └── servers.json                   (PgAdmin server config)
│
├── src/                               (EMPTY - CRITICAL BLOCKER)
├── index.html
├── package.json                       (Frontend deps: React 19, Vite, TailwindCSS, etc.)
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── eslint.config.js
├── PROJECT_CONTEXT.md                 (THIS FILE)
└── build-check.txt                    (Previous build artifacts - cleanup needed)
```

## Frontend Stack (Configured)

```json
{
  "react": "^19.2.6",
  "react-dom": "^19.2.6",
  "react-router-dom": "^7.17.0",
  "typescript": "^5.5.4",
  "vite": "^5.4.1",
  "tailwindcss": "^3.4.4",
  "axios": "^1.18.1",
  "@tanstack/react-query": "^5.101.0",
  "zustand": "^4.5.0",
  "react-hook-form": "^7.79.0",
  "zod": "^4.4.3",
  "recharts": "^2.9.0",
  "framer-motion": "^11.0.0",
  "lucide-react": "^0.499.0",
  "react-hot-toast": "^2.4.0"
}
```

## Backend Stack (Minimal)

```json
{
  "express": "^5.2.1",
  "cors": "^2.8.6",
  "dotenv": "^17.4.2",
  "pg": "^8.21.0"
}
```

**Status:** Dependencies configured but controllers NOT implemented.

---

# DATABASE SCHEMA STATUS

## Status: ✅ COMPLETE & SEEDED

**File:** `backend/init.sql`

**Contents:**
- 16 tables with full migrations
- Comprehensive seed data (users, candidates, companies, headhunters, job offers, applications, interviews, etc.)
- Proper enums, constraints, and relationships
- Test data for immediate development (12 candidates, 10 companies, 10 headhunters)

**Tables:**
1. users (6 users + 30 seed users)
2. candidates (2 + 10 seed)
3. companies (2 + 10 seed)
4. headhunters (1 + 10 seed)
5. technologies (5 + 10 seed)
6. benefits (4 + 10 seed)
7. company_technologies
8. company_benefits
9. job_offers (3 + 10 seed)
10. offer_technologies
11. applications (3 + 10 seed)
12. interviews (1 + 10 seed)
13. favorites (2 + 10 seed)
14. company_reviews (2 + 10 seed)
15. review_comments (2 + 10 seed)
16. salaries (3 + 10 seed)

**Docker Setup:** `docker-compose.yml` spins up PostgreSQL 14 with volume persistence.

---

# FINAL ARCHITECTURE DECISION

DO NOT migrate to Next.js during MVP.

Use:

```text
Vite
React 19
TypeScript
React Router 7
Tailwind CSS
Axios
TanStack Query
Zustand
React Hook Form
Zod
Recharts
Framer Motion
Lucide React Icons
React Hot Toast
```

Reason:

* Faster MVP delivery
* Existing project already uses Vite
* Most pages are authenticated dashboards
* SEO is not MVP critical
* All dependencies already installed

Future migration to Next.js is acceptable after MVP validation.

---

# DESIGN ANALYSIS SUMMARY

The uploaded UI represents a modern SaaS dashboard.

Primary layout:

```text
Sidebar (collapsible)
Header (search, notifications, theme, user menu)
Main Content
```

Patterns detected:

* KPI Cards
* Tables with pagination and sorting
* Filters and search
* Dashboard Widgets
* Charts (line, bar, donut)
* Company Profiles
* Reviews system
* Salary Analytics
* Candidate Tracking

Estimated reusable component count:

120-180 components.

---

# DESIGN SYSTEM DECISIONS

## Typography

Primary Font: **Inter**

Fallback:
```css
font-family: Inter, system-ui, sans-serif;
```

## Font Scale

```text
12px Caption
14px Body Small
16px Body
18px Subtitle
20px Section Title
24px Page Title
32px Hero
```

## Colors

| Use | Color |
|-----|-------|
| Primary | #6D5EF5 |
| Secondary | #8B7BFF |
| Success | #22C55E |
| Warning | #F59E0B |
| Danger | #EF4444 |
| Background | #F8FAFC |
| Card | #FFFFFF |
| Sidebar Dark | #081426 |
| Sidebar Darker | #0D1B2A |

## Radius

```text
8px   - Inputs
12px  - Cards
16px  - Modals
```

## Shadows

```css
0 2px 8px rgba(0,0,0,.06)   /* Light */
0 8px 24px rgba(0,0,0,.08)  /* Heavy */
```

---

# RESPONSIVE STRATEGY

Desktop:
```text
Expanded Sidebar (240px)
Full-width main content
```

Tablet:
```text
Collapsed Sidebar (64px)
Adjusted grid layout
```

Mobile:
```text
Hidden Sidebar
Drawer Navigation (slide-in)
Single column layout
```

Grid: 12-column layout

Breakpoints:
```text
640px   (sm)
768px   (md)
1024px  (lg)
1280px  (xl)
1536px  (2xl)
```

---

# ACCESSIBILITY REQUIREMENTS

Mandatory:

* WCAG AA compliance
* Keyboard Navigation (Tab, Enter, Escape)
* Focus States (visible rings)
* ARIA Labels (aria-label, aria-describedby)
* Semantic HTML (button, form, nav, main, etc.)

Every component must support:

```text
Loading   - Skeleton or spinner
Error     - Error message + retry
Empty     - Empty state placeholder
Success   - Confirmation toast
```

Charts require:

```text
Accessible summary (aria-label)
Tooltip on hover/focus
Table fallback (data representation)
```

---

# FEATURE MODULES & PAGES

## Public Features (12 pages)

- [x] **Landing Page** — Hero, CTA, features overview
- [x] **About Page** — Company info
- [x] **Login Page** — Email + password, role detection
- [x] **Register Candidate** — Full profile form
- [x] **Register Company** — Company details
- [x] **Job Offers List** — Filterable, searchable list
- [x] **Job Offer Detail** — Full offer with apply button
- [x] **Companies List** — Directory with filters
- [x] **Company Detail** — Profile, reviews, open offers
- [x] **Reviews** — Ratings and reviews from all users
- [x] **Salaries** — Market analytics and trends
- [x] **Search** — Global search across offers and companies

## Authentication (6 pages)

- [x] **Login** — Role-based login
- [x] **Register Candidate** — With profile setup
- [x] **Register Company** — With company details
- [x] **Logout** — Session cleanup
- [x] **Protected Routes** — Role guards
- [x] **Role Guards** — Per-role access control

## Candidate Feature (5 pages)

- [x] **Dashboard** — KPI cards, applications, upcoming interviews
- [x] **Profile CRUD** — Edit personal info, experience, technologies
- [x] **Applications** — View status, withdraw
- [x] **Favorites** — Saved companies and offers
- [x] **Interviews** — Scheduled interviews timeline

## Company Feature (4 pages)

- [x] **Dashboard** — Active offers, applicants, interviews
- [x] **Job Offers CRUD** — Create, edit, publish, close offers
- [x] **Applications** — Review candidates, change status
- [x] **Interviews** — Schedule and track interviews

## Headhunter Feature (3 pages)

- [x] **Dashboard** — Active placements, matches
- [x] **Candidate Search** — Filter and match candidates
- [x] **Matches & Recommendations** — Future AI integration

## Admin Feature (8 pages)

- [x] **Dashboard** — System overview
- [x] **Users CRUD** — Manage all users
- [x] **Companies CRUD** — Manage company accounts
- [x] **Candidates CRUD** — Manage candidate accounts
- [x] **Offers CRUD** — Full job offer management
- [x] **Interviews CRUD** — Interview administration
- [x] **Technologies CRUD** — Technology tags
- [x] **Salaries** — Market data management

## Reviews System (2 pages)

- [x] **Ratings & Reviews** — 5-star ratings with categories
- [x] **Comments** — Company responses to reviews

## Salaries System (1 page)

- [x] **Salary Analytics** — Market trends by role, level, tech

---

# FINAL FOLDER STRUCTURE

```text
src/
│
├── app/
│   ├── App.tsx                        [Root component with providers]
│   ├── router.tsx                     [React Router config]
│   ├── providers/
│   │   ├── QueryProvider.tsx
│   │   ├── AuthProvider.tsx
│   │   └── ThemeProvider.tsx
│   └── layouts/
│       ├── DashboardLayout.tsx
│       ├── AuthLayout.tsx
│       └── PublicLayout.tsx
│
├── api/
│   ├── axios.ts                       [Axios instance with JWT]
│   ├── endpoints.ts                   [Endpoint constants]
│   └── modules/
│       ├── authApi.ts
│       ├── usersApi.ts
│       ├── candidatesApi.ts
│       ├── companiesApi.ts
│       ├── offersApi.ts
│       ├── applicationsApi.ts
│       ├── favoritesApi.ts
│       ├── interviewsApi.ts
│       ├── technologiesApi.ts
│       ├── headhuntersApi.ts
│       ├── salariesApi.ts
│       ├── offerTechnologiesApi.ts
│       └── reviewsApi.ts
│
├── features/
│   ├── auth/
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterCandidatePage.tsx
│   │   │   └── RegisterCompanyPage.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   ├── candidates/
│   │   ├── pages/
│   │   │   ├── CandidateDashboardPage.tsx
│   │   │   ├── CandidateProfilePage.tsx
│   │   │   ├── ApplicationsPage.tsx
│   │   │   ├── FavoritesPage.tsx
│   │   │   └── InterviewsPage.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   ├── companies/
│   ├── offers/
│   ├── applications/
│   ├── favorites/
│   ├── interviews/
│   ├── technologies/
│   ├── reviews/
│   ├── salaries/
│   ├── headhunters/
│   └── admin/
│
├── shared/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Pagination.tsx
│   │   └── [... 20+ more UI components]
│   ├── forms/
│   │   ├── FormInput.tsx
│   │   ├── FormSelect.tsx
│   │   ├── FormCheckbox.tsx
│   │   ├── FormRadio.tsx
│   │   ├── FormTextarea.tsx
│   │   └── FormError.tsx
│   ├── tables/
│   │   ├── Table.tsx
│   │   ├── TablePagination.tsx
│   │   └── useSortableTable.ts
│   ├── charts/
│   │   ├── LineChart.tsx
│   │   ├── BarChart.tsx
│   │   ├── DonutChart.tsx
│   │   └── useChartAccessibility.ts
│   ├── feedback/
│   │   ├── ToastProvider.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorState.tsx
│   │   ├── EmptyState.tsx
│   │   └── SkeletonLoader.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useToast.ts
│   │   ├── useMediaQuery.ts
│   │   ├── usePagination.ts
│   │   ├── useSortAndFilter.ts
│   │   └── [... 10+ more]
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── dateUtils.ts
│   │   ├── chartUtils.ts
│   │   └── api-error.ts
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── breakpoints.ts
│   │   └── messages.ts
│   └── types/
│       ├── index.ts
│       ├── api.ts
│       ├── forms.ts
│       └── common.ts
│
├── store/
│   ├── authStore.ts                   [Zustand: JWT, user role]
│   ├── themeStore.ts                  [Zustand: dark/light mode]
│   ├── sidebarStore.ts                [Zustand: collapsed/expanded]
│   ├── notificationStore.ts           [Zustand: notifications queue]
│   └── filtersStore.ts                [Zustand: search/filter state]
│
├── assets/
│   ├── icons/
│   ├── images/
│   ├── logos/
│   └── illustrations/
│
└── styles/
    ├── globals.css                    [Tailwind + custom CSS vars]
    └── theme.css                      [Theme CSS custom properties]
```

---

# COMPONENT TREE

## App Shell

```text
App
├── QueryProvider (TanStack Query)
├── AuthProvider (Zustand + context)
├── ThemeProvider (Zustand + CSS vars)
├── ToastProvider (react-hot-toast)
└── Router (React Router)
```

## Dashboard Layout

```text
DashboardLayout
├── Sidebar
│   ├── Logo
│   ├── NavLinks (role-aware)
│   └── CollapseToggle
├── Header
│   ├── SearchInput
│   ├── NotificationsDropdown
│   ├── ThemeSwitcher
│   └── UserDropdown
└── MainContent (page outlet)
```

## Header Components

```text
Header
├── SearchInput
├── NotificationsDropdown
├── ThemeSwitcher
└── UserDropdown
    ├── Profile Link
    ├── Settings Link
    └── Logout Button
```

## Candidate Dashboard

```text
CandidateDashboard
├── WelcomeBanner
├── MetricsGrid
│   ├── ApplicationsCard (count + link)
│   ├── FavoritesCard (count + link)
│   ├── InterviewsCard (count + upcoming)
│   └── ProfileCompletionCard (%)
├── RecommendedOffers (horizontal scroll)
├── RecentActivity (timeline)
└── UpcomingInterviews (list)
```

## Company Dashboard

```text
CompanyDashboard
├── MetricsGrid
│   ├── ActiveOffersCard
│   ├── ApplicationsCard
│   ├── InterviewsCard
│   └── HiresCard
├── ActiveOffersTable (sortable, filterable)
├── ApplicantsChart (bar chart by offer)
├── InterviewsWidget (upcoming)
└── RecentApplications (list)
```

---

# ROUTING STRUCTURE

## Public Routes

```text
/                                 Landing
/about                           About
/login                           Login
/register-candidate              Register Candidate
/register-company                Register Company
/job-offers                       Job Offers List
/job-offers/:id                  Job Offer Detail
/companies                        Companies List
/companies/:id                   Company Detail
/reviews                         Reviews
/salaries                        Salaries Analytics
/search?q=...                    Global Search
```

## Candidate Routes (Protected)

```text
/candidate/dashboard             Dashboard
/candidate/profile               Profile
/candidate/applications          Applications List
/candidate/favorites             Favorites
/candidate/interviews            Interviews Timeline
```

## Company Routes (Protected)

```text
/company/dashboard               Dashboard
/company/offers                  Offers List
/company/offers/new              Create Offer
/company/offers/:id              Edit Offer
/company/applications            Applications
/company/interviews              Interviews
```

## Headhunter Routes (Protected)

```text
/headhunter/dashboard            Dashboard
/headhunter/candidates           Candidate Search
/headhunter/matches              Matches
```

## Admin Routes (Protected)

```text
/admin                           Dashboard
/admin/users                     Users CRUD
/admin/companies                 Companies CRUD
/admin/candidates                Candidates CRUD
/admin/offers                    Offers CRUD
/admin/interviews                Interviews CRUD
/admin/technologies              Technologies CRUD
/admin/salaries                  Salaries CRUD
```

---

# STATE MANAGEMENT DECISION

## Zustand (Client State Only)

Stores:

```ts
// authStore — JWT, user role, login/logout
const useAuthStore = create((set) => ({
  token: null,
  user: null,
  role: null,
  setAuth: (token, user, role) => set({ token, user, role }),
  logout: () => set({ token: null, user: null, role: null }),
}));

// themeStore — dark/light mode
const useThemeStore = create((set) => ({
  isDark: false,
  toggle: () => set((s) => ({ isDark: !s.isDark })),
}));

// sidebarStore — collapsed/expanded
const useSidebarStore = create((set) => ({
  isOpen: true,
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));

// notificationStore — toast queue
const useNotificationStore = create((set) => ({
  notifications: [],
  add: (msg) => set((s) => ({ notifications: [...s.notifications, msg] })),
  remove: (id) => set((s) => ({
    notifications: s.notifications.filter(n => n.id !== id)
  })),
}));

// filtersStore — search/filter state
const useFiltersStore = create((set) => ({
  searchQuery: '',
  selectedFilters: {},
  setSearch: (q) => set({ searchQuery: q }),
  setFilters: (f) => set({ selectedFilters: f }),
}));
```

Use **ONLY** for:
- Authentication tokens and user metadata
- UI toggle states (sidebar, theme)
- Global notifications
- Filter/search state

---

## TanStack Query (Server State)

Use for all data fetching:

```text
Candidates
Companies
Offers
Applications
Interviews
Favorites
Technologies
Reviews
Salaries
Headhunters
Users
```

**Example Hook:**
```ts
function useCandidates() {
  return useQuery({
    queryKey: ['candidates'],
    queryFn: () => candidatesApi.getAll(),
  });
}
```

**NEVER** store server collections in Zustand.

---

# API ARCHITECTURE

## Axios Instance

Responsibilities:

```ts
const axiosInstance = axios.create({
  baseURL: process.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT Injection
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token Refresh Logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token logic
      // If refresh fails, redirect to login
    }
    return Promise.reject(error);
  }
);
```

## API Modules

Each module follows CRUD standard:

```ts
// Example: candidatesApi.ts
export const candidatesApi = {
  getAll: () => api.get('/candidates'),
  getById: (id) => api.get(`/candidates/${id}`),
  create: (payload) => api.post('/candidates', payload),
  update: (id, payload) => api.put(`/candidates/${id}`, payload),
  remove: (id) => api.delete(`/candidates/${id}`),
};
```

## API Modules List

```text
authApi          — login, register-candidate, register-company
usersApi         — CRUD for users
candidatesApi    — CRUD for candidates
companiesApi     — CRUD for companies
offersApi        — CRUD for job offers
applicationsApi  — CRUD for applications
favoritesApi     — add/remove, list
interviewsApi    — CRUD for interviews
technologiesApi  — list, create
headhuntersApi   — profile, CRUD
salariesApi      — analytics endpoints
offerTechnologiesApi — link tech to offers
reviewsApi       — CRUD for reviews
```

---

# AUTHENTICATION REQUIREMENTS

## Backend Endpoints (NOT YET IMPLEMENTED)

```http
POST /auth/login                      Request: { email, password }
POST /auth/register-candidate         Request: { email, password, full_name, bio, location, experience_years, preferred_modality }
POST /auth/register-company           Request: { email, password, company_name, description, industry, size, location, website }
POST /auth/refresh-token              Request: { refreshToken }
POST /auth/logout                     Request: {}
```

## User Roles

```ts
type UserRole =
  | "candidate"
  | "company"
  | "headhunter"
  | "admin";
```

## Frontend Requirements

- [x] **Protected Routes** — Only logged-in users access protected pages
- [x] **Role Guards** — Routes gated by user role (e.g., /company/* only for companies)
- [x] **Guest Guards** — Logged-in users redirected from /login
- [x] **Role Detection** — Backend returns role in login response
- [x] **JWT Storage** — Secure token storage (localStorage or sessionStorage)
- [x] **Token Refresh** — Automatic token refresh on 401 response
- [x] **Logout** — Clear token, navigate to login

---

# PENDING IMPLEMENTATION PHASES

## PHASE 5: Backend API Implementation ⚠️ CRITICAL BLOCKER

### Status: **NOT STARTED**

### 5.1 Controllers (Missing)
Needed: authController, usersController, candidatesController, companiesController, offersController, applicationsController, favoritesController, interviewsController, technologiesController, headhuntersController, salariesController, reviewsController

**Deliverable:** Typed Express controllers with proper error handling and validation.

### 5.2 Authentication & Security (Missing)
Needed: JWT generation/validation, password hashing (bcrypt), RBAC middleware, protected route guards

**Deliverable:** Auth middleware with typed payloads.

### 5.3 Database Queries (Missing)
Needed: Query layers for all 16 tables, parameterized queries, transaction handling

**Deliverable:** Query functions with TypeScript DTOs.

---

## PHASE 6: Frontend Feature Implementation ⚠️ CRITICAL BLOCKER

### Status: **NOT STARTED** — Source code does NOT exist

### 6.1 Core App Shell (Missing)
- `src/app/App.tsx` — Root component with providers
- `src/app/router.tsx` — React Router configuration
- `src/app/providers/` — QueryProvider, AuthProvider, ThemeProvider

### 6.2 API Client Layer (Missing)
- `src/api/axios.ts` — Configured Axios instance with JWT
- `src/api/endpoints.ts` — Centralized endpoint constants
- `src/api/modules/` — 13 typed API modules

### 6.3 State Management (Missing)
- 5 Zustand stores: authStore, themeStore, sidebarStore, notificationStore, filtersStore

### 6.4 Shared Components (Missing)
- 50+ reusable UI components
- Form components with Zod validation
- Table, chart, feedback components
- 10+ custom hooks

### 6.5 Layouts (Missing)
- DashboardLayout, AuthLayout, PublicLayout
- Sidebar, Header, MainContent components
- Mobile drawer navigation

### 6.6 Feature Pages (Missing)
- 12 public pages (landing, login, register, offers, companies, reviews, salaries, search)
- 5 candidate pages
- 4 company pages
- 3 headhunter pages
- 8 admin pages

---

## PHASE 7: Testing & QA ⏳ PENDING

### Status: **NOT STARTED**

- Unit tests (React Testing Library, jest)
- Integration tests (feature workflows)
- E2E tests (Playwright or Cypress)

---

## PHASE 8: Deployment & DevOps ⏳ PENDING

### Status: **NOT STARTED**

- Docker containerization
- CI/CD pipeline (GitHub Actions)
- Environment management
- Database migrations

---

## PHASE 9: Documentation & Polish ⏳ PENDING

### Status: **NOT STARTED**

- API documentation (OpenAPI/Swagger)
- Component library (Storybook)
- Developer guide

---

# CURRENT IMPLEMENTATION STATUS

**Date:** 2026-07-01  
**Phase:** 5 — Backend API implementation (NOT STARTED)

## What Exists ✅

- [x] Database schema (16 tables) — `backend/init.sql`
- [x] Seed data (36 users, comprehensive test data)
- [x] Docker setup (PostgreSQL container)
- [x] Frontend dependency configuration
- [x] Backend skeleton (`backend/src/app.js`)
- [x] Backend dependency configuration

## What's Missing ❌

- [ ] Frontend source code (`src/` — ENTIRE DIRECTORY EMPTY)
- [ ] Backend controllers (0 of 12 implemented)
- [ ] Backend models (0 of 12 implemented)
- [ ] Backend routes with handlers (empty directory)
- [ ] API client modules (0 of 13 implemented)
- [ ] React components (0 of 100+ needed)
- [ ] Feature pages (0 of 32 needed)
- [ ] Tests (0 coverage)
- [ ] Deployment configuration

## Latest Findings (2026-07-01)

1. **Frontend completely missing** — Only config files (tsconfig, vite.config, package.json)
2. **Backend scaffold minimal** — Express app.js exists but no logic
3. **Database complete** — All schema, constraints, and seed data ready
4. **Dependencies ready** — All npm packages pre-configured, may need `--legacy-peer-deps`
5. **Critical blocker** — Backend API required before frontend can fetch data

---

# CRITICAL PATH

## Priority Order:

1. **Phase 5.1** — Implement backend controllers for authentication first
2. **Phase 5.2** — Implement JWT auth middleware and password hashing
3. **Phase 5.3** — Implement remaining controllers (CRUD operations)
4. **Phase 6.1** — Create frontend app shell and providers
5. **Phase 6.2** — Create API client with typed endpoints
6. **Phase 6.3** — Implement shared components and layouts
7. **Phase 6.6** — Implement feature pages (public → protected)
8. **Phase 7** — Add tests
9. **Phase 8** — Deploy

---

# CODING STANDARDS

## TypeScript

- Strict mode enabled
- Avoid `any` type
- Use DTOs and interfaces
- Nullable types must be explicit (`string | null`)

## Components

Requirements:

```text
Reusable    — Accept props, not hardcoded values
Accessible  — WCAG AA, ARIA labels, semantic HTML
Responsive  — Mobile-first, Tailwind breakpoints
Typed       — Props interface, return types
```

## Forms

Use:

```text
React Hook Form + Zod validation
No uncontrolled forms
Error messages on blur/submit
```

## Styling

Use:

```text
Tailwind CSS (no custom CSS unless critical)
CSS custom properties for theming
Responsive classes (sm:, md:, lg:)
Dark mode support
```

## Error Handling

Every component must handle:

```text
Loading state    — Show skeleton or spinner
Error state      — Show error message + retry
Empty state      — Show placeholder
Success state    — Show confirmation (toast or inline)
```

---

# NAMING CONVENTIONS

## Components

```text
PascalCase (React convention)
Examples: Button, UserDropdown, CandidateDashboard
```

## Hooks

```text
useSomething (start with 'use')
Examples: useAuth, useCandidates, useMediaQuery
```

## Stores (Zustand)

```text
somethingStore (camelCase + 'Store')
Examples: authStore, themeStore, filtersStore
```

## Types & Interfaces

```text
SomethingDto           (Data Transfer Object)
SomethingResponse      (API response)
SomethingFormData      (Form submission payload)
SomethingPayload       (Request payload)
ISomething             (Interfaces — optional 'I' prefix)
```

## Files

```text
Components:      Button.tsx, UserDropdown.tsx
Hooks:           useAuth.ts, useCandidates.ts
Stores:          authStore.ts, themeStore.ts
Types:           types.ts, dtos.ts
Utils:           formatters.ts, validators.ts
APIs:            candidatesApi.ts, offersApi.ts
```

---

# MVP SCOPE

## Must Include

- [x] Authentication (login, register by role)
- [x] Candidate CRUD (profile creation, editing)
- [x] Company CRUD (company profile, editing)
- [x] Technologies CRUD (tag management)
- [x] Job Offer CRUD (create, edit, publish)
- [x] Apply To Offer (candidate action)
- [x] Favorites (save offers/companies)
- [x] Interview Scheduling (add interview to application)
- [x] Candidate Dashboard (KPIs, metrics)
- [x] Company Dashboard (active offers, applicants)
- [x] Search (global search across offers, companies)
- [x] Filters (offer filters, company filters)
- [x] Protected Routes (role-based access)

## Workflow

```text
1. Register (candidate or company)
2. Create Profile (personal or company info)
3. Browse Jobs (search, filter)
4. Apply (submit application)
5. Favorite (save offer or company)
6. Interview (company schedules, candidate confirms)
7. Hire (accept offer)
```

---

# BACKEND CONTRACTS (PostgreSQL)

All contracts defined in `backend/init.sql`.

Expected REST endpoints (to be implemented):

```http
POST   /auth/login
POST   /auth/register-candidate
POST   /auth/register-company
POST   /auth/refresh-token

GET    /candidates
GET    /candidates/:id
POST   /candidates
PUT    /candidates/:id
DELETE /candidates/:id

GET    /companies
GET    /companies/:id
POST   /companies
PUT    /companies/:id
DELETE /companies/:id

GET    /job-offers
GET    /job-offers/:id
POST   /job-offers
PUT    /job-offers/:id
DELETE /job-offers/:id

GET    /applications
POST   /applications
PUT    /applications/:id

GET    /favorites
POST   /favorites
DELETE /favorites/:id

GET    /interviews
POST   /interviews
PUT    /interviews/:id

GET    /technologies
POST   /technologies

GET    /salaries
POST   /salaries

GET    /headhunters
POST   /headhunters

GET    /reviews
POST   /reviews
```

---

# REPOSITORY STRUCTURE CLEANUP NEEDED

Remove these build artifacts:

```text
- build-check.txt
- build-output.txt
- install-output.txt
- install-clean.txt
- install-output-utf8.txt
- install-js-output.txt
- npm-cache-verify.txt
- npm-cache-verify2.txt
- npm-ls-eslint-js.txt
- tsc-direct.txt
- tsc-npx.txt
- dryrun.json
```

These were from previous build attempts and should be removed before committing.

---

# CONTINUATION INSTRUCTIONS

If session ends or token limit reached, continue from this state:

## Immediate Priorities

1. **Backend Controllers** — Implement 12 controllers in `backend/src/controllers/`
2. **Database Query Layer** — Create query helpers in `backend/src/models/`
3. **Route Handlers** — Wire controllers to routes in `backend/src/routes/`
4. **Frontend App Shell** — Create `src/app/App.tsx` with providers
5. **API Client** — Create `src/api/` module structure

## Validation Checklist

- [ ] Backend `npm install` completes without errors
- [ ] Frontend `npm install` completes without errors
- [ ] Docker container spins up PostgreSQL successfully
- [ ] Backend server starts on port 3000
- [ ] Frontend dev server starts on port 5173
- [ ] Auth endpoints respond (POST /auth/login returns typed response)
- [ ] Frontend can fetch from backend without CORS errors
- [ ] Login flow works end-to-end

## Build Commands

```bash
# Backend
cd backend/src
npm install
npm run dev  # or node app.js

# Frontend
npm install
npm run dev

# Database
cd backend
docker-compose up -d
# Connect: postgres://postgres:password@localhost:5432/duckyjob
```

---

# NOTES & ASSUMPTIONS

1. **Database schema is authoritative** — All API responses must match init.sql structure
2. **TypeScript mandatory** — No JavaScript files in feature code
3. **Tailwind-first** — Prefer utility classes over custom CSS
4. **Role-based access** — Every protected route checks `user.role`
5. **Error boundaries** — Wrap feature pages in error boundaries
6. **Loading states** — Every async operation shows loading spinner
7. **Empty states** — Every list shows placeholder when empty
8. **Toast notifications** — Success/error messages via react-hot-toast
9. **Responsive required** — All pages tested on mobile, tablet, desktop
10. **Accessibility required** — All interactive elements keyboard accessible

---

# BLOCKERS & RISKS

## Critical Blockers 🚨

1. **No frontend source code** — `src/` directory is empty. Need to generate entire codebase.
2. **No backend controllers** — Cannot start frontend until API returns data.
3. **Dependency conflicts** — `npm install` may need `--legacy-peer-deps` flag.

## Medium Risks ⚠️

1. **TypeScript strict mode** — Some older libraries may not have types. Consider `@types/` packages.
2. **Database connection** — Docker PostgreSQL must start successfully. Verify docker-compose.yml port mapping.
3. **Environment variables** — Frontend needs `.env.local` with `VITE_API_URL`. Backend needs `.env` with `DATABASE_URL`.

## Low Risks ℹ️

1. **Performance** — With 36 seed users, database queries should be fast. Consider pagination for large lists later.
2. **SEO** — Landing page and public pages don't need SEO during MVP. Consider Next.js migration if needed.

---

# SUCCESS CRITERIA

## Phase 5 Complete ✅

- [x] All 12 backend controllers implemented
- [x] Authentication flow works (register → login → token → protected route)
- [x] All CRUD endpoints return typed responses
- [x] Error handling consistent across endpoints
- [x] CORS configured correctly

## Phase 6 Complete ✅

- [x] React app renders without errors
- [x] All 32 feature pages created
- [x] Navigation works across all roles
- [x] Forms submit successfully
- [x] Data loads from backend API

## Phase 7 Complete ✅

- [x] Unit tests: 80%+ coverage on utils and hooks
- [x] Integration tests: Auth flow, CRUD workflows
- [x] E2E tests: Critical user journeys

## Phase 8 Complete ✅

- [x] Docker build succeeds
- [x] Frontend builds to static files
- [x] CI/CD pipeline runs on every push
- [x] Deploy to staging/production

---

**END OF PROJECT_CONTEXT.MD**

Handoff prepared: 2026-07-01
Next developer: Please review PENDING IMPLEMENTATION PHASES and CRITICAL PATH sections.
All database contracts finalized. Ready for backend implementation.
