# Niranjan Hiremath — Portfolio

A production-ready portfolio built as two independent applications:

| Part | Stack | Directory |
| --- | --- | --- |
| Frontend | React 18, TypeScript, Vite, React Router, Lucide | `frontend/` |
| Backend | Spring Boot 3.3, Java 17, MySQL, SMTP | `backend/` |

The frontend is a static SPA and can be hosted anywhere. The backend exposes a
single contact endpoint and is optional — the site works fully without it, the
form simply reports that it could not reach the server.

---

## Content rules

**All content lives in one file: `frontend/src/data/portfolio.ts`.**

Nothing in that file is invented. Where a fact is unknown it is an empty string
or `false`, and the UI degrades gracefully rather than rendering a placeholder as
if it were real. The values currently left blank on purpose:

| Field | Why it is blank | How to publish it |
| --- | --- | --- |
| `identity.location` | Home base not confirmed | Set it and the "Based in" rows render again |
| `identity.responseTime` | A response-time promise is a commitment | Set it only once decided |
| `projects[].repositoryUrl` | Shoonya is not published publicly | Set the URL to show a repository button |
| `leadership[].details` | Responsibilities not supplied | Fill in `details` and set `pending: false` |

`profileLinks.linkedin`, `profileLinks.github` and `profileLinks.leetcode` are
configured with the URLs supplied by Niranjan and render normally. If any URL is
ever blanked again, that link disappears from production and shows a
non-clickable configuration reminder in development instead of a dead profile
icon.

Confirmed: **Shoonya is a 5-inch racing quadcopter**, so the title reads
"Shoonya — 5-inch Racing Quadcopter". The resume PDF, the Shoonya photographs
and the About visual are published under `frontend/public/` - see
[Assets](#assets).

---

## Assets

Every image and the resume live in `frontend/public/`, are committed, and are
**not** git-ignored. Replacing one is a file swap; no code change is needed as
long as the filename stays the same.

| Asset | Path | Notes |
| --- | --- | --- |
| About visual | `frontend/public/images/about/ganesha.jpg` | **Not a portrait.** Decorative image only - it does not depict Niranjan and is never described as him. Swap the file for a personal photograph whenever you like. |
| Shoonya hero | `frontend/public/images/shoonya/01.jpg` | Featured project + case-study hero |
| Shoonya gallery | `frontend/public/images/shoonya/02.jpg` … `04.jpg` | 3 images, captions in `portfolio.ts` |
| Resume PDF | `frontend/public/resume/Niranjan-Hiremath-Resume.pdf` | Filename must match `resume.path`; `resume.available` is `true` |

All four supplied Shoonya photographs are the same three-quarter view, so the
captions and alt text describe what is actually visible rather than angles the
photos do not show. Images render at their native aspect ratio - never `cover`,
never cropped.

**Important:** the resume PDF is content-only. It is *not* the source of truth
for `portfolio.ts`. When a newer resume arrives, compare the fields deliberately
rather than letting the document overwrite the approved content.

---

## Requirements

- **Node.js 18+** (developed on 22.14) and npm
- **JDK 17+** (developed on 26) — Maven is **not** required, the wrapper is
  committed
- **MySQL 8** — only needed to persist submissions, or to run the API the way it
  runs in production. For local development you do **not** need it; see
  "Running without MySQL" below.

---

## Frontend

```bash
cd frontend
npm install
cp .env.example .env      # then edit .env
npm run dev               # http://localhost:5173
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Typecheck (`tsc -b`) then production build to `dist/` |
| `npm run preview` | Serve the built output on port 4173 |
| `npm run lint` | Typecheck only |

### Frontend environment

All variables are prefixed `VITE_` and are therefore **public** — never put a
secret in this file.

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | yes | Backend base URL, e.g. `https://api.example.com/api` |
| `VITE_SITE_URL` | yes | Canonical origin, no trailing slash. Drives SEO `canonical` and `og:url` |
| `VITE_DEFAULT_TITLE` | no | Document title suffix |
| `VITE_DEFAULT_DESCRIPTION` | no | Meta description |

Two things that look like they belong here but deliberately do not:

- **CORS is a backend setting.** Allowed origins are configured with
  `CORS_ALLOWED_ORIGINS` in the backend environment. A `VITE_CORS_ALLOWED_ORIGINS`
  would do nothing.
- **The contact email is not read from the environment.** It lives in
  `src/data/portfolio.ts` as `identity.email`, so there is one source of truth
  for all site content.

### Deployment

`npm run build` emits a fully static `dist/`. Because this is an SPA with real
URL paths, the host must rewrite unknown paths to `index.html`, otherwise a
refresh on `/projects/shoonya` will 404.

- **Netlify** — publish directory `dist`. The required rewrite is already
  committed as `frontend/public/_redirects`, which Vite copies into `dist`.
- **Vercel** — `frontend/vercel.json` is already set up with the build command,
  output directory, and rewrite. Deploy from the `frontend` directory.
- **Nginx** — add `try_files $uri $uri/ /index.html;`

`robots.txt` and `favicon.svg` are served from `frontend/public/` and are
already in the build output.

---

## Backend

### Running without MySQL

The fastest way to see the whole thing working, with no database and no SMTP
account:

```bash
cd backend
./mvnw spring-boot:run -Pdev-h2 -Dspring-boot.run.profiles=dev-h2
```

That serves the API on <http://localhost:8080> against an in-memory H2 database
and logs messages instead of sending them. Data is discarded when the process
stops. The two halves are needed: `-Pdev-h2` puts H2 on the classpath, and
`-Dspring-boot.run.profiles=dev-h2` selects the matching configuration.

### Running against MySQL

```bash
cd backend
export DB_HOST=localhost DB_NAME=portfolio DB_USERNAME=portfolio DB_PASSWORD=secret
./mvnw spring-boot:run
```

The API **will not start without a reachable database** — Hibernate fails fast
with an `entityManagerFactory` bean-creation error if it cannot connect. That is
intentional: silently starting with no way to store a message would look like it
worked. For local overrides, copy `src/main/resources/application-local.yml.example`
to `src/main/resources/application-local.yml` — that filename is git-ignored.

| Command | Purpose |
| --- | --- |
| `./mvnw test` | Run the test suite (73 tests; no MySQL or SMTP needed) |
| `./mvnw spring-boot:run -Pdev-h2 -Dspring-boot.run.profiles=dev-h2` | Start with H2, no setup |
| `./mvnw spring-boot:run` | Start against MySQL |
| `./mvnw package` | Build `target/portfolio-backend.jar` |
| `java -jar target/portfolio-backend.jar` | Run the packaged jar |

The wrapper (`mvnw` / `mvnw.cmd`) downloads Maven automatically, so a global
Maven install is not needed.

### Configuration

Configuration comes from environment variables. For local overrides, copy
`src/main/resources/application-local.yml.example` to
`src/main/resources/application-local.yml` — that filename is git-ignored.

**Database**

| Variable | Default | Description |
| --- | --- | --- |
| `DB_HOST` | `localhost` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_NAME` | `portfolio` | Database name |
| `DB_USERNAME` | `root` | MySQL user |
| `DB_PASSWORD` | *(empty)* | MySQL password |
| `JPA_DDL_AUTO` | `update` | Use `validate` in production |

**SMTP** — the provider is deliberately not assumed. Fill these in for whichever
service you use.

| Variable | Default | Description |
| --- | --- | --- |
| `MAIL_HOST` | *(empty)* | SMTP host |
| `MAIL_PORT` | `587` | `587` for STARTTLS, `465` for implicit SSL |
| `MAIL_USERNAME` | *(empty)* | SMTP account |
| `MAIL_PASSWORD` | *(empty)* | SMTP password or app password |
| `MAIL_STARTTLS_ENABLE` | `true` | Set false for port 465 |
| `MAIL_SSL_ENABLE` | `false` | Set true for port 465 |
| `MAIL_PROPERTIES_LOCALHOST` | *(empty)* | Only if the provider demands a local address |
| `MAIL_FROM` | *(empty)* | Optional From address; blank means send from `MAIL_USERNAME` |
| `MAIL_FROM_NAME` | `Portfolio` | Display name for the From header |

**Contact behaviour**

| Variable | Default | Description |
| --- | --- | --- |
| `CONTACT_RECEIVER_EMAIL` | `niranjanhiremath11@gmail.com` | Inbox for submissions |
| `CONTACT_MAIL_ENABLED` | `false` | `false` logs instead of sending — use locally |
| `CONTACT_STORE_IN_DATABASE` | `true` | Also write to `contact_messages` |
| `CONTACT_RATE_LIMIT_MAX_REQUESTS` | `3` | Submissions per address per window |
| `CONTACT_RATE_LIMIT_WINDOW_MINUTES` | `10` | Window length |
| `CORS_ALLOWED_ORIGINS` | *(empty)* | Comma-separated allowed origins |
| `SERVER_PORT` | `8080` | HTTP port |

> `MAIL_FROM` is usually left blank. Gmail, Outlook, Brevo and SendGrid all
> reject mail whose From does not match the authenticated account, so the
> username is the safe default. Set it only when your provider allows a
> different From.

### Database

The app owns exactly one table, `contact_messages`:

```sql
CREATE TABLE contact_messages (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(254) NOT NULL,
    message    TEXT         NOT NULL,
    created_at DATETIME(6)  NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_contact_messages_created_at (created_at)
);
```

A copy lives in `backend/src/main/resources/schema.sql`. With the default
`JPA_DDL_AUTO=update` it is created automatically on first run. In production,
set `JPA_DDL_AUTO=validate` and apply the script once by hand.

Column widths are sized to match the DTO limits, so any request that passes
validation is guaranteed to fit.

---

## API

### `POST /api/contact`

```jsonc
// request
{
  "name": "Visitor Name",          // 1-100 chars
  "email": "visitor@example.com",  // valid email
  "message": "At least 10 chars", // 10-5000 chars
  "website": ""                    // honeypot — leave empty
}
```

```jsonc
// 200 OK
{ "success": true, "message": "Message sent successfully." }
```

```jsonc
// 400 Bad Request
{
  "success": false,
  "message": "Please correct the highlighted fields.",
  "errors": { "email": "Enter a valid email address." }
}
```

| Status | When |
| --- | --- |
| `200` | Accepted, or honeypot tripped (a bot sees a success and is discarded) |
| `400` | Validation failed, or the body was not valid JSON |
| `429` | Rate limit exceeded |
| `503` | Delivery failed — safe to retry |
| `500` | Unexpected error; the response never contains internals |

Also available: `GET /api/health` and `GET /api/status`. Actuator exposes
`/actuator/health` with details suppressed.

### Anti-abuse

- **Validation** is enforced on the server; the client-side checks in
  `src/services/contact.ts` mirror them for fast feedback but are not trusted.
- **Honeypot** — a hidden `website` field. If filled, the request is discarded
  silently and nothing is sent or stored.
- **Rate limit** — per client address, `3` per `10` minutes by default, using the
  first entry in `X-Forwarded-For` when present. Expired windows are pruned on a
  schedule.

> Behind a reverse proxy or load balancer, configure it to set `X-Forwarded-For`
> correctly, otherwise every visitor shares one rate-limit bucket.

### Sanitisation

Input is sanitised before anything else touches it:

- Single-line fields have CR/LF, control and zero-width characters removed, then
  trimmed — this closes off mail-header injection.
- The message keeps paragraph structure, but CRLF is normalised to LF and runs of
  blank lines are collapsed.
- The HTML mail body escapes `& < > " '`, so a submitted message cannot inject
  markup into the notification email.
- The Reply-To address is built as a real `InternetAddress` with a cleaned
  display name.

---

## Testing

```bash
cd backend  && ./mvnw test     # 73 tests
cd frontend && npm run build   # typecheck + production build
```

The backend suite runs fully offline. `src/test/resources/application-test.yml`
swaps MySQL for in-memory H2 and disables mail, and the web-layer tests use a
hand-written `RecordingContactService` rather than Mockito, so the suite is not
tied to whatever JDK Byte Buddy happens to support.

Covered: input sanitisation, DTO constraints and boundary lengths, rate
limiting, honeypot handling, the JSON error envelope, internal-detail leakage,
configuration defaulting, entity timestamps, and CORS policy.

`ContactIntegrationTest` is the important one: it posts over real HTTP through
the real controller and service and then asserts what actually reached the
database, including that a 100-character name and a 5000-character message are
not truncated by the column widths. It would catch a broken transaction
boundary, which neither the unit nor the web-slice tests can.

No test relies on Mockito's bytecode instrumentation, so the suite runs on any
JDK rather than only the versions a given Byte Buddy release happens to
support.

---

## Accessibility and SEO

- Skip link, single `h1` per page, labelled landmarks, visible focus rings
- Form fields have real `<label>`s, `aria-describedby` hints, and an
  `aria-live` status region
- The mobile drawer traps nothing it should not, closes on `Escape`, and returns
  focus
- `prefers-reduced-motion` disables reveal and page transitions
- Per-route `<title>`, meta description, canonical URL, Open Graph and Twitter
  tags, and `Person` JSON-LD
- Colour contrast meets WCAG AA; the palette is defined once in
  `src/styles/tokens.css`

---

## Project layout

```
frontend/
  public/            favicon.svg, robots.txt, _redirects (Netlify SPA rewrite)
                     images/{about,shoonya}/, resume/  (asset drop points)
  src/
    components/      Navbar, Footer, Button, cards, ContactForm, Seo, ...
    config/site.ts   environment-backed runtime config
    data/            portfolio.ts  <- all content lives here
    pages/           one file per route
    services/        contact.ts (API client + validation)
    styles/          tokens.css, base.css, components.css, responsive.css
  vercel.json        Vercel build + SPA rewrite
backend/
  mvnw, mvnw.cmd     Maven wrapper (no global Maven needed)
  pom.xml            Spring Boot 3.3.5, Java 17
  src/main/java/com/niranjanhiremath/portfolio/
    config/          ContactProperties, WebConfig (CORS)
    controller/      ContactController, HealthController
    dto/             ContactRequest, ApiResponse
    entity/          ContactMessage
    exception/       typed exceptions + GlobalExceptionHandler
    repository/      ContactMessageRepository
    service/         ContactService, ContactMailService, RateLimitService
    util/            InputSanitizer
  src/main/resources/
    application.yml           main configuration
    schema.sql                contact_messages DDL
    application-dev-h2.yml    zero-setup local run
    application-local.yml.example
  src/test/          73 tests, including ContactIntegrationTest
```

## Security notes

- No secrets are committed; `.env` files and `application-local.yml` are ignored.
- Secrets arrive via environment variables and are never logged or returned.
- Error responses are generic; the underlying cause is logged server-side only.
- Mail headers are constructed defensively against injection.
- `Server` and Actuator error details are disabled so internals cannot leak
  through the default error page.

## Known gaps

These are intentionally unfinished rather than faked:

- Shoonya build notes, challenges and "what I learned" rows are marked `pending`
  until the write-up exists
- Leadership responsibilities are marked `pending`
- No public repository for Shoonya, so the repository button is omitted
- `identity.location` and `identity.responseTime` are unset on purpose
