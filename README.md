# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/67341840-11dd-4875-a614-02f15b7fe0a1

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/67341840-11dd-4875-a614-02f15b7fe0a1) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Configure environment variables.
# Copy .env.example to .env and add your Google Apps Script webhook URL
cp .env.example .env
# Edit .env and set VITE_GOOGLE_SHEETS_WEBHOOK_URL

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Project Details

This is a team registration form for **FLUXathon**, sponsored by Google. The application features:

- **Countdown Page** - Landing page with countdown timer to registration opening
- **Registration Form** - Team submission form with capacity tracking
- Dark, techy design with bright blue (#316EFF) accent color
- Geometric background patterns
- FLUXathon branding and Google sponsorship
- Team capacity tracking (max 20 teams)
- Real-time submission count from Google Sheets

### Countdown Feature

The application displays a countdown timer page at the root URL (`/`) that counts down to the configured launch time (default: **October 16, 2025 at 12:00 PM EDT**). The countdown page includes:

- **Real-time countdown timer** in DD:HH:MM:SS format
- **Silkscreen pixelated font** for retro dot-matrix display aesthetic
- **Event schedule cards** showing the three-day FLUXathon schedule:
  - **Thursday, Oct 23**: Google Workshop at Deloitte Welcome Center
  - **Friday, Oct 24**: Shed Session at The Shed (all day work session)
  - **Saturday, Oct 25**: Finals at Poetter Hall
- **Automatic redirect** to registration form (`/form`) when countdown reaches zero

#### Launch Time Protection

The registration form at `/form` is protected and will show an error message if accessed before the configured launch time. Users attempting to access the form early will see a "Registration Not Open" message and be automatically redirected back to the countdown page after 3 seconds. This prevents early submissions and confusion.

## Configuration

### Launch Time Configuration

The registration form opening time is configurable via environment variable:

1. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Set the launch time in `.env`:
   ```
   VITE_LAUNCH_TIME=2025-10-16T12:00:00-04:00
   ```

**Format:** ISO 8601 with timezone offset
- EDT (Eastern Daylight Time): Use `-04:00` offset
- EST (Eastern Standard Time): Use `-05:00` offset
- For other timezones, adjust the offset accordingly

**Examples:**
```
# October 16, 2025 at 12:00 PM EDT
VITE_LAUNCH_TIME=2025-10-16T12:00:00-04:00

# For testing: 5 minutes from now (if current time is 2:00 PM EDT)
VITE_LAUNCH_TIME=2025-01-15T14:05:00-05:00
```

If not configured, the default launch time is October 16, 2025 at 12:00 PM EDT.

### Google Sheets Integration

This form integrates with Google Sheets via a Google Apps Script webhook. To configure:

1. Create a Google Apps Script that handles form submissions
2. Deploy it as a web app and copy the webhook URL
3. Set your webhook URL in `.env`:
   ```
   VITE_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

The webhook should handle two actions:
- `action=checkCount`: Returns the current submission count as `{ count: number }`
- `action=submit`: Saves the team submission data to Google Sheets

#### Race Condition Protection

The form includes multiple layers of protection against race conditions where multiple teams attempt to submit simultaneously for the 20th spot:

**Client-Side Protection:**
- Real-time capacity polling every 5 seconds while the form is active
- Users are automatically shown the "Capacity Reached" screen if the limit is reached while filling out the form
- Pre-submission capacity check before sending data to the server

**Server-Side Protection (Required):**
Your Google Apps Script webhook **must implement atomic capacity checking** to prevent race conditions. When handling `action=submit`:

1. Check the current count in the spreadsheet
2. If count >= 20, return an error response:
   ```javascript
   return ContentService.createTextOutput(JSON.stringify({
     error: "CAPACITY_REACHED"
   })).setMimeType(ContentService.MimeType.JSON);
   ```
3. If count < 20, atomically append the submission and increment count
4. Return success response

**Important:** The client will handle the `CAPACITY_REACHED` error gracefully by showing the capacity reached screen. This ensures that even in race conditions, no more than 20 teams can be registered.

### Design System

The application uses a custom dark theme with:
- Background: Dark blue-gray (#0d1117 approx)
- Primary/Accent: Bright blue (#316EFF)
- Geometric blur patterns for visual interest
- Glassmorphism effects on cards

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/67341840-11dd-4875-a614-02f15b7fe0a1) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
