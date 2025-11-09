# Wedding Invitation App

A simple React app for wedding invitations with Russian and Hebrew translations.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update the Make webhook URL in `src/InvitationPage.jsx`:
   - Replace `MAKE_WEBHOOK_URL` with your actual Make webhook URL
   - The webhook should accept GET requests with `?action=get&username=...` to fetch user data
   - The webhook should accept POST requests with JSON body: `{ username, willCome, peopleCount }`

3. Run the development server:
```bash
npm run dev
```

## Usage

Access the app via: `http://localhost:5173/{lang}/{username}`

Examples:
- `http://localhost:5173/RU/UsernameUsername`
- `http://localhost:5173/heb/UsernameUsername`

## Make Webhook Setup

Your Make webhook should:
1. Handle GET requests to fetch user data by username
2. Handle POST requests to save invitation responses

Example POST payload:
```json
{
  "username": "UsernameUsername",
  "willCome": true,
  "peopleCount": 3
}
```

