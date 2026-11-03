# PolyFlow open-source architecture

## Current release: self-hosted multi-session prototype

```text
Browser / installed PWA
        |
        v
Node BFF (server.mjs)
        |-- Canvas REST API
        |-- DeepSeek API
        `-- future Microsoft Graph
```

Users can connect Canvas in two ways:

1. On localhost, a Python Playwright bridge opens Chrome for a first login. The user completes ADFS/MFA on the official page, and later syncs reuse a browser profile under `.data/canvas-profile`.
2. Where administrators allow it, a Personal Access Token pasted into the interface is bound to a random HttpOnly session cookie and encrypted at rest with AES-256-GCM.

Provider secrets never return to the browser, and Canvas data is cached for five minutes and refreshed automatically. The browser bridge is a desktop-only compatibility path; it must remain disabled on public servers.

Outlook mail and calendar can be connected in two local ways:

1. A Python Playwright bridge (`bridge/outlook_bridge.py`) opens Outlook on the web for a first sign-in and later reads the inbox and calendar through the session, using the web app's internal `/owa/service.svc` JSON actions (`FindItem`, `GetItem`, `GetCalendarView`). The profile lives in `.data/outlook-profile`. Classic Outlook on the web authenticates these calls with cookies plus `X-OWA-CANARY`; the new Outlook at `outlook.cloud.microsoft` uses a bearer token acquired in the page. The bridge observes the page's own `service.svc` requests and reuses their auth headers in memory only. These actions are undocumented, so the bridge reports `OWA_API_CHANGED` instead of guessing when a response does not match.
2. On macOS, `bridge/mac_mail.js` runs through `osascript -l JavaScript`, reading Apple Mail or legacy Outlook for Mac via scripting and the calendar via EventKit. No network access or extra sign-in is involved.

Both return the same normalised schema (`mails[]`, `events[]`, `warnings[]`), which `server.mjs` sanitises, caches for five minutes and serves at `GET /api/outlook/sync`. Only one sync runs at a time. All local API routes require a loopback Host header to prevent DNS rebinding.

This is not yet a public multi-tenant service. There is no account login, password reset or identity recovery, and a user who steals another browser's session cookie could access its Canvas connection. Deploy only on a trusted host until OIDC authentication is added.

## Target multi-user architecture

```text
Desktop PWA / mobile PWA
           |
      HTTPS + session cookie
           |
        API / BFF
       /    |    \
 Auth    PostgreSQL   Worker queue
 OIDC    /    \       /     \
      users  encrypted   Canvas   Graph
             credentials connectors connectors
                              \
                             AI gateway
```

### Identity

Use a maintained OIDC provider rather than implementing passwords. Each browser gets a signed, HTTP-only, Secure, SameSite session cookie. Social login is optional; self-hosted deployments can use a local OIDC server.

### Per-user storage

Suggested tables:

```text
users
  id, email, display_name, created_at, deleted_at

integration_accounts
  id, user_id, provider, institution_url, account_label,
  encrypted_payload, key_version, created_at, revoked_at

sync_runs
  id, integration_account_id, started_at, finished_at, status, error_code

notification_preferences
  user_id, channel, digest_time, timezone, enabled
```

Never store provider tokens as plaintext. Use envelope encryption:

- a key encryption key (KEK) comes from a KMS or deployment secret;
- each credential record receives a data encryption key;
- store only ciphertext, nonce/IV, authentication tag and key version;
- rotate keys without requiring users to reconnect.

The current self-hosted implementation already stores per-session credentials encrypted. The production upgrade is to replace browser-session ownership with an authenticated user ID and move the JSON records into PostgreSQL.

### Canvas connector

Prefer an institution-approved OAuth flow. If a self-hosted user supplies a Personal Access Token, it must be tied to that user's row and encrypted at rest.

The connector should retain:

- course and assignment IDs;
- due date and timezone;
- submission workflow state;
- submitted timestamp and attempt number;
- last successful sync and error code.

Do not infer "not submitted" when an API request fails. Show "状态未知" instead.

### Outlook connector

Use Microsoft Entra OAuth with read-only scopes such as `Mail.Read` and `Calendars.Read`. Store refresh tokens encrypted, support revocation, and default to fetching message metadata plus recent bodies only when generating a translation or summary.

### AI provider

Two viable deployment modes:

1. The operator supplies a server-side DeepSeek key with spending limits.
2. Users bring their own key, encrypted and scoped to their account.

Before calling a model, collect only the minimum required content. Emails are untrusted data and their embedded instructions must not affect system behavior. Never send Canvas passwords, tokens, cookies or unrelated private data.

### Background sync

Move synchronization from browser intervals to a worker queue:

- start a sync on first connection;
- refresh active accounts every 5–15 minutes;
- serialize jobs per integration account;
- exponential backoff on rate limits;
- batch notifications after sync completion.

The in-memory cache in `server.mjs` is deliberately simple and should be replaced by PostgreSQL plus a queue for multi-user deployment.

## Why not account/password scraping?

- It requires storing a credential that can unlock more than Canvas.
- ADFS commonly includes MFA and device challenges.
- Canvas HTML changes can turn deadline parsing into incorrect submission status.
- Browser cookies are not safely portable to a mobile PWA or a different device.
- Open-sourcing a password automation path encourages insecure deployments and may violate institutional policy.

If the institution does not permit tokens or OAuth, the connector should be disabled rather than falling back to credential harvesting.

## Open-source release checklist

- ~~Select and add a license.~~ MIT, see `LICENSE`.
- Add authentication and multi-user isolation before exposing a hosted demo.
- Run dependency, secret and container image scanning.
- Provide `.env.example`, Docker deployment and health checks.
- Remove personal names, student data and private screenshots from fixtures.
- Add encrypted credential storage and migration scripts.
- Document institution-specific API approval requirements.
- Add integration tests with mocked Canvas and Graph responses.
- Publish a threat model and data retention policy.
