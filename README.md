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

## Configuration

### Google Sheets Integration

This form integrates with Google Sheets via a Google Apps Script webhook. To configure:

1. Create a Google Apps Script that handles form submissions
2. Deploy it as a web app and copy the webhook URL
3. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Set your webhook URL in `.env`:
   ```
   VITE_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

The webhook should handle two actions:
- `action=checkCount`: Returns the current submission count as `{ count: number }`
- `action=submit`: Saves the team submission data to Google Sheets

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/67341840-11dd-4875-a614-02f15b7fe0a1) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
