# ChimpMail

A small Go-based mass-email sender that reads recipients from a CSV, applies an HTML template, and sends emails concurrently using worker goroutines.

**Repository files**
- [main.go](main.go): program entrypoint, starts workers and loads recipients.
- [producer.go](producer.go): reads `name_email.csv` and streams recipients into a channel.
- [consumer.go](consumer.go): worker that executes the template and sends email via SMTP.
- [email.tmpl](email.tmpl): HTML email template used by `executeTemplate`.
- [name_email.csv](name_email.csv): example recipients CSV (header: `Name,Email`).
- [info.md](info.md): project notes.
- [go.mod](go.mod): Go module file.

**Prerequisites**
- Go 1.18+ installed.
- A local SMTP testing server (MailHog, Mailtrap, or the Python debugging SMTP server) for development.

**Quick start (local testing)**
1. Start a local SMTP test server. For MailHog (Docker):

```bash
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

Or use Python's built-in debugging SMTP server:

```bash
python3 -m smtpd -c DebuggingServer -n localhost:1025
```

2. Ensure `name_email.csv` exists with a header row `Name,Email` and recipient rows.

3. Run the application from the repository root:

```bash
go run .
```

Or build and run a binary:

```bash
go build -o chimpmail .
./chimpmail
```

The program starts N worker goroutines (configured in `main.go`) that read recipients from `name_email.csv`, render `email.tmpl`, and send messages to the SMTP server on `localhost:1025` by default.

**CSV format**
The CSV should have a header and two columns: `Name,Email`. Example:

```
Name,Email
Alice Example,alice@example.com
Bob Example,bob@example.com
```

**Template**
`email.tmpl` is parsed by `text/template` and passed a single data object for each recipient (fields: name and email). Edit the template to customize the message body.

**Troubleshooting**
- If you see `undefined: recipientsChan` or similar, there are known typos in the repository: the code currently uses the type and variable names `Recepient` and `recepientsChan` (misspelled). Consider renaming to `Recipient` and `recipientsChan` consistently.
- SMTP errors: confirm your test SMTP server is running on port `1025` or update `consumer.go` with your SMTP host/port/credentials.

**Next steps / enhancements**
- Add SMTP configuration via environment variables or a config file.
- Add logging and retries for failed sends.
- Add unit tests for CSV parsing and template rendering.
- Add batching/rate-limiting when sending to large lists.

