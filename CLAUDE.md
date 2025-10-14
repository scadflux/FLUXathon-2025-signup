# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the FLUXathon team registration form (sponsored by Google) built with Vite + React + TypeScript + shadcn/ui. The application features a dark, techy design with geometric patterns and integrates with Google Sheets via Google Apps Script webhooks for data persistence.

## Tech Stack

- **Build Tool**: Vite 5.x with React SWC plugin
- **Framework**: React 18 with React Router DOM
- **Language**: TypeScript 5.x
- **UI Components**: shadcn/ui (Radix UI primitives + Tailwind CSS)
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS with custom theming via CSS variables
- **Dev Server**: Port 8080 (host: "::")

## Common Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server (port 8080)
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Architecture

### Application Structure

- **Entry Point**: `src/main.tsx` renders the `App` component
- **Router**: `src/App.tsx` sets up React Router with QueryClient and Toaster providers
- **Pages**:
  - `src/pages/Countdown.tsx` - countdown timer landing page (root `/`)
  - `src/pages/Index.tsx` - registration form page (`/form`) with launch time guard
  - `src/pages/NotFound.tsx` - 404 fallback
- **Core Component**: `src/components/TeamSubmissionForm.tsx` - main form logic and UI
- **Utilities**: `src/lib/launchTime.ts` - launch time configuration and validation

### Countdown and Launch Flow

1. **Pre-Launch (default)**: Countdown page displays at `/` with timer and event schedule
2. **Launch Time Protection**: Form at `/form` blocked until configured launch time
   - Shows "Registration Not Open" error if accessed early
   - Auto-redirects to countdown page after 3 seconds
3. **Post-Launch**: Countdown page auto-redirects to `/form` when timer expires
4. **Launch Time Utility** (`src/lib/launchTime.ts`):
   - `getLaunchTime()`: Returns configured launch Date object
   - `hasLaunched()`: Boolean check if launch time passed
   - `calculateTimeRemaining()`: Returns days/hours/minutes/seconds remaining

### Form Submission Flow

1. User configures Google Apps Script webhook URL in the form
2. Form validates team name + 3 team members (first name, last name, email each)
3. Capacity check: Queries webhook with `action=checkCount` to verify < 20 submissions
4. Submit: Posts form data with `action=submit` as URL-encoded parameters
5. Success/capacity states handled with success screen or capacity reached screen

### Key Components

- **CountdownPage** (`src/pages/Countdown.tsx`): Landing page component with:
  - Real-time countdown timer (DD:HH:MM:SS format)
  - Silkscreen pixelated font for retro aesthetic
  - Event schedule cards (Thursday/Friday/Saturday)
  - Auto-redirect to `/form` when countdown expires
  - Uses `calculateTimeRemaining()` from launch time utility

- **Index** (`src/pages/Index.tsx`): Form route wrapper with:
  - Launch time guard using `hasLaunched()` utility
  - "Registration Not Open" error screen for early access
  - Auto-redirect to countdown page after 3 seconds
  - Renders `TeamSubmissionForm` when launched

- **TeamSubmissionForm** (`src/components/TeamSubmissionForm.tsx:29`): Main form component with:
  - Webhook URL configuration state
  - Capacity tracking (max 20 teams)
  - Form validation via Zod schema
  - Three submission states: form, success screen, capacity reached
  - URLSearchParams for Google Apps Script compatibility

### Styling System

- Uses Tailwind with CSS variable-based theming (HSL color format)
- Dark theme with bright blue (#316EFF / 220 100% 60%) as primary color
- Geometric background patterns using blurred circles with primary color
- Glassmorphism effects on cards (backdrop-blur-sm)
- Shadow effects with primary color glow on hover
- Theme colors: primary, secondary, accent, destructive, muted, card, background, etc.
- All colors reference CSS variables (e.g., `hsl(var(--primary))`)

### Path Aliases

- `@/*` → `src/*` (configured in vite.config.ts and tsconfig.json)
- `/fluxathon.svg` → FLUXathon logo in public directory

## Environment Variables

- `VITE_LAUNCH_TIME`: Registration form opening time
  - Format: ISO 8601 with timezone offset (e.g., `2025-10-16T12:00:00-04:00`)
  - Default: October 16, 2025 at 12:00 PM EDT
  - Controls countdown timer and form access protection
  - Configured in `.env` file (see `.env.example` for template)

- `VITE_GOOGLE_SHEETS_WEBHOOK_URL`: Google Apps Script webhook URL for form submissions
  - Configured in `.env` file (see `.env.example` for template)
  - Required for form submission functionality
  - Must support two actions: `checkCount` and `submit`

## Important Notes

- Lovable integration: This project can be edited via Lovable.dev platform
- Component tagging: `lovable-tagger` plugin enabled in development mode
- Webhook URL configured via environment variable (not user input)
- Submission limit hardcoded to 20 teams in `TeamSubmissionForm.tsx:27`
- FLUXathon branding: Logo displayed as hero, "Sponsored by Google" tagline
- Design aesthetic: Dark techy theme with geometric patterns inspired by FLUXathon presentation slides
