# Contributing

**Purpose:** Explain how to contribute to VoxText AI effectively.
**Audience:** Contributors and maintainers.
**Last Updated:** February 11, 2026
**Version:** v0.1

## Table of Contents
- Code of Conduct
- Setup
- Branching and Commits
- Pull Requests
- Issues
- Testing and Linting
- Security Reporting
- Related Documents

## Code of Conduct
Be respectful and constructive. Harassment and abusive behavior are not tolerated.

## Setup
See [Setup Guide](Setup-Guide.md) for local setup instructions.

## Branching and Commits
- Branch naming: `feat/<short-name>`, `fix/<short-name>`, `docs/<short-name>`.
- Commit style: `type(scope): summary` (example: `feat(api): add format endpoint docs`).

## Pull Requests
Please include:
- A clear description of changes.
- Screenshots for UI changes.
- Linked issue if applicable.

PR checklist:
- [ ] Docs updated (if behavior changed).
- [ ] Manual testing completed.
- [ ] No secrets committed.

## Issues
- Use bug or feature templates when available.
- Bug reports: include steps to reproduce and logs.
- Feature requests: describe the problem and expected behavior.

## Testing and Linting
- Frontend: `npm run build` (ensures TypeScript and bundling).
- Backend: no automated tests are configured yet.

## Security Reporting
If you discover a security issue, avoid posting sensitive details publicly. Open a private issue or contact the maintainer before disclosure.

## Related Documents
- [README](README.md)
- [Setup Guide](Setup-Guide.md)
