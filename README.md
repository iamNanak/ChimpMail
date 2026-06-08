# ChimpMail

ChimpMail is a small bulk-email project with two parts:

- a Go backend that accepts recipients, renders HTML email content, and sends messages through SMTP
- a Next.js frontend in [chimpmailfe](chimpmailfe) that provides the landing page, login flow, and dashboard for composing sends

The frontend rewrites `/api/send` and `/api/templates` to the Go server on `http://localhost:8081`, so both apps are intended to run together during local development.

## Repository Layout

- [main.go](main.go): Go backend entrypoint and HTTP server setup.
- [route.go](route.go): API routes for `/api/send` and `/api/templates`.
- [consumer.go](consumer.go): worker that renders the email template and sends mail through SMTP.
- [producer.go](producer.go): CSV loading helper for turning `name_email.csv` rows into recipients.
- [email.tmpl](email.tmpl): HTML template used by the Go backend.
- [name_email.csv](name_email.csv): sample recipient data.
- [go.mod](go.mod): Go module definition.
- [chimpmailfe](chimpmailfe): Next.js frontend app.
- [info.md](info.md): local SMTP helper command.

## Prerequisites

- Go 1.25.5 or compatible.
- Node.js 18+ for the frontend.
- A local SMTP testing server such as Mailpit, MailHog, or Python's debugging SMTP server.

## Local Development

1. Start a local SMTP test server.

Mailpit via Docker:

```bash
docker run -d --restart unless-stopped --name=mailpit -p 8025:8025 -p 1025:1025 axllent/mailpit
```

Or Python's debugging SMTP server:

```bash
python3 -m smtpd -c DebuggingServer -n localhost:1025
```

2. Start the Go backend from the repository root.

```bash
go run .
```

The backend listens on `http://localhost:8081`.

3. Start the Next.js frontend in a second terminal.

```bash
cd chimpmailfe
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`.

4. Open the frontend, sign in, and use the dashboard to compose a send.

## How It Works

- The frontend exposes a landing page, login page, and dashboard.
- The dashboard lets you pick a template, enter a subject, add recipients from CSV, paste, or manual entry, and preview the email.
- The frontend posts send requests to `/api/send`, which is rewritten to the Go backend.
- The backend fans recipients out to worker goroutines, renders `email.tmpl`, and sends each message via SMTP on `localhost:1025` by default.
- Sent jobs are stored in the browser history panel on the frontend.

## API Endpoints

- `GET /api/templates`: returns the template list used by the dashboard.
- `POST /api/send`: accepts `templateId`, `subject`, and `recipients`.
- `POST /api/auth/login`: creates the frontend session cookie.
- `POST /api/auth/logout`: clears the session cookie.

## CSV Format

The repository includes [name_email.csv](name_email.csv) as an example of the expected recipient input format.

```csv
Name,Email
Alice Example,alice@example.com
Bob Example,bob@example.com
```

## Notes

- The Go backend currently uses a local SMTP host and port in [consumer.go](consumer.go). Update that file if you want to send through another SMTP service.
- The login flow in the frontend is intentionally lightweight and uses a session cookie stub rather than full authentication.
- If the frontend cannot reach the backend, make sure both servers are running and that the rewrites in [chimpmailfe/next.config.ts](chimpmailfe/next.config.ts) still point to `localhost:8081`.

## Troubleshooting

- SMTP connection errors usually mean the local SMTP server is not running or is listening on a different port.
- If the dashboard shows no templates, confirm the Go backend is running and serving `/api/templates`.
- If send requests fail from the frontend, check the backend terminal for worker or template errors.

