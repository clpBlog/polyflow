# Contributing

Thanks for considering a contribution. PolyFlow is currently a self-hosted PWA with encrypted per-session Canvas credentials. Real account authentication and database-backed tenant isolation are required before a public hosted release.

## Local development

```bash
npm start
npm run check
```

Use `DEEPSEEK_MOCK=1` when testing UI behavior without spending AI credits.

## Pull requests

- Keep secrets, personal data and real university credentials out of commits and fixtures.
- Do not add password-based automated login, CAPTCHA bypass or MFA circumvention.
- Prefer official Canvas, Microsoft Graph and AI provider APIs.
- Include screenshots or accessibility notes for visible interface changes.
- Keep desktop and 390 px mobile layouts usable.
- Document new configuration variables in `.env.example` and `README.md`.

## Connector changes

Canvas and Outlook connectors must:

- use least-privilege read scopes;
- avoid logging message bodies, files or credentials;
- preserve submitted time, attempt and workflow state separately from local completion;
- support revocation and deletion;
- remain useful when one course or module cannot be fetched.

## Licensing

Contributions are accepted under the [MIT License](LICENSE). Do not add third-party logos, fonts or other assets unless their license allows redistribution, and note them under "Third-party material" in `LICENSE`.

## Tests

```bash
npm run check   # syntax check for server, bridges and web/src
npm test        # offline tests for the Outlook bridge and the Mac mail reader
```
