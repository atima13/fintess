# Octofit Tracker Frontend

This React 19 + Vite presentation tier uses `react-router-dom` for navigation and calls backend endpoints under:

`https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/[component]/`

## Environment Variables

Define `VITE_CODESPACE_NAME` before running the app.

Example in `.env.local`:

```bash
VITE_CODESPACE_NAME=your-codespace-name
```

When `VITE_CODESPACE_NAME` is set, the app targets the Codespaces API domain above.

If `VITE_CODESPACE_NAME` is not set, the app safely falls back to relative URLs like `/api/users/`, preventing invalid URLs such as `https://undefined-8000.app.github.dev/...`.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```
