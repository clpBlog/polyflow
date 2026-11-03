# Security policy

## Supported version

Security fixes currently target the latest commit on the default branch.

## Reporting

Please report vulnerabilities through GitHub private vulnerability reporting when the repository is published. Do not include API keys, Canvas tokens, NetPassword credentials, email contents or personal student data in a public issue.

## Secrets

- `.env`, `.env.local` and local integration credentials must never be committed.
- A Canvas Personal Access Token must be revocable independently of the user's NetPassword.
- Public instances must not use a shared Canvas token for multiple users.
- Search logs must not contain full Canvas tokens, Microsoft tokens or DeepSeek API keys.
- `.data/canvas-profile` and `.data/outlook-profile` contain browser session cookies. Treat them as credentials and never expose or commit them.
- Keep `CANVAS_BRIDGE_ENABLED=0` and `OUTLOOK_BRIDGE_ENABLED=0` on public hosts and containerized servers without an interactive desktop.

## Local connectors

The Canvas bridge, the Outlook bridge and the Mac mail-app reader run only when the server binds to a loopback address. In that mode every `/api/*` request must carry a `127.0.0.1` / `localhost` Host header, and cross-origin POST, DELETE and PUT requests are rejected. This blocks DNS-rebinding pages from reading Canvas or mail data through the local port. Do not remove this check.

All three connectors are read-only. Contributions must not add sending, deleting, moving or marking mail as read, and must not make mail content leave the machine except for the single message a user explicitly asks DeepSeek to summarise or translate (or has opted in to with "打开邮件时自动生成摘要").

The Outlook bridge reads Outlook on the web's internal `/owa/service.svc` JSON endpoints with the user's own session. They are undocumented and may change; treat the bridge as experimental and fail closed (show an error, never fall back to scraping rendered pages).

## Account access

PolyFlow does not automate ADFS or Microsoft password login. Do not contribute code that stores university passwords, bypasses MFA, solves CAPTCHAs or scrapes rendered HTML of an authenticated page. The local bridges reuse a session the user created by signing in themselves, and only read JSON endpoints that the site's own web app uses.

## Current limitations

This version is intended for trusted self-hosting. Canvas credentials are encrypted per browser session, but there is no account login or multi-tenant database isolation. Do not expose it directly to the public internet until authentication, CSRF protection, persistent rate limiting, recovery flows and server-side session revocation are implemented.
