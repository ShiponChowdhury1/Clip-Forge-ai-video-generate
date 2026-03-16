## ClipForge - Render Deployment

This project is configured for Render Blueprint deploy using [render.yaml](render.yaml).

## Requirements

- Node.js 20.x
- A backend API URL
- (Optional) Google OAuth Client ID

## Environment Variables

Set these in Render service settings:

- `NEXT_PUBLIC_API_URL` (required)
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (optional, required only for Google login)

You can use [.env.example](.env.example) as a reference.

## Deploy On Render

1. Push this repository to GitHub.
2. In Render, click **New +** -> **Blueprint**.
3. Select this repository.
4. Render will detect [render.yaml](render.yaml) automatically.
5. Add required environment variables.
6. Click **Apply** to deploy.

## Local Run

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.
