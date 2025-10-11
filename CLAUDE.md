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
- **Pages**: `src/pages/Index.tsx` (main page) and `src/pages/NotFound.tsx` (404 fallback)
- **Core Component**: `src/components/TeamSubmissionForm.tsx` - main form logic and UI

### Form Submission Flow

1. User configures Google Apps Script webhook URL in the form
2. Form validates team name + 3 team members (first name, last name, email each)
3. Capacity check: Queries webhook with `action=checkCount` to verify < 20 submissions
4. Submit: Posts form data with `action=submit` as URL-encoded parameters
5. Success/capacity states handled with success screen or capacity reached screen

### Key Components

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
