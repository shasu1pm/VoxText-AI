# Contributing to VoxText AI

**VoxText AI — Open-Source Contribution Guide**

> **Purpose:** Provide clear guidelines for contributing to VoxText AI, including setup, conventions, pull requests, issue reporting, and security disclosure.
> **Audience:** Contributors, open-source developers, and maintainers.
> **Last Updated:** 2026-02-12
> **Version:** 0.1.0

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Branch Naming Conventions](#branch-naming-conventions)
- [Commit Message Style](#commit-message-style)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Issue Templates](#issue-templates)
- [Lint and Build Commands](#lint-and-build-commands)
- [Code Style Guidelines](#code-style-guidelines)
- [Security Reporting](#security-reporting)
- [Recognition](#recognition)
- [Related Documents](#related-documents)

---

## Code of Conduct

VoxText AI is committed to providing a welcoming and inclusive environment for everyone. By participating in this project, you agree to the following principles:

- **Be respectful.** Treat all contributors with courtesy and professionalism, regardless of experience level, background, or identity.
- **Be constructive.** Provide helpful feedback. Critique ideas, not people. Suggest improvements rather than just pointing out problems.
- **Be inclusive.** Use welcoming language. Make space for new contributors. Assume good intent.
- **No harassment.** Harassment, personal attacks, trolling, and abusive behavior are not tolerated under any circumstances.

Violations may result in comments being removed, PRs being closed, or contributors being blocked at the maintainer's discretion.

---

## Getting Started

For full setup instructions, see the **[Setup Guide](Setup-Guide.md)**.

**Quick summary:**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shasu1pm/VoxText-AI.git
   cd VoxText-AI
   ```

2. **Start the backend:**
   ```bash
   cd Backend
   pip install -r requirements.txt
   python server.py
   # Runs at http://127.0.0.1:5000
   ```

3. **Start the frontend (new terminal):**
   ```bash
   cd Frontend
   npm install
   npm run dev
   # Runs at http://localhost:5173
   ```

4. **Verify** by opening `http://localhost:5173` in your browser and testing a YouTube URL.

**Prerequisites:** Node.js 18+, Python 3.9+, FFmpeg on PATH.

---

## Branch Naming Conventions

Use the following prefixes when creating branches:

| Prefix | Purpose | Example |
|---|---|---|
| `feat/` | New feature or enhancement | `feat/playlist-support` |
| `fix/` | Bug fix | `fix/download-timeout` |
| `docs/` | Documentation changes only | `docs/update-api-reference` |
| `refactor/` | Code restructuring without behavior change | `refactor/split-app-component` |
| `test/` | Adding or updating tests | `test/language-detection-pytest` |

**Rules:**

- Use lowercase with hyphens (kebab-case): `feat/redis-cache`, not `feat/RedisCache`
- Keep names short but descriptive
- Branch from `main` unless otherwise specified

---

## Commit Message Style

Follow the **conventional commits** format:

```
type(scope): summary
```

### Types

| Type | When to Use |
|---|---|
| `feat` | New feature or user-facing enhancement |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code restructuring without behavior change |
| `test` | Adding or updating tests |
| `chore` | Build scripts, dependencies, tooling, CI config |

### Scope

The scope is optional but recommended. Use the component or area being changed:

- `api` — Backend API endpoints
- `ui` — Frontend UI components
- `lang` — Language detection or translation
- `cache` — Caching logic
- `export` — Transcript export (DOCX/TXT/SRT)
- `download` — Video/audio download flow
- `config` — Configuration or environment variables
- `deps` — Dependency updates

### Examples

```
feat(api): add health check endpoint
fix(download): handle missing Content-Length header
docs(readme): update quick start instructions
refactor(ui): extract transcript panel into separate component
test(lang): add pytest cases for Unicode script detection
chore(deps): bump yt-dlp to 2026.1
```

### Rules

- Use the imperative mood: "add feature", not "added feature" or "adding feature"
- Keep the summary line under 72 characters
- Do not end the summary with a period
- Add a blank line and body text for non-trivial changes if needed

---

## Pull Request Guidelines

### PR Template

When opening a pull request, include the following in your description:

```markdown
## Description

<!-- What does this PR do? Why is it needed? -->

## Screenshots

<!-- For UI changes, include before/after screenshots. Remove this section if not applicable. -->

## Related Issue

<!-- Link to the issue this PR addresses, e.g., Fixes #42. Remove if not applicable. -->

## Checklist

- [ ] Description of changes is included above
- [ ] Screenshots attached for UI changes (if applicable)
- [ ] Linked issue (if applicable)
- [ ] Documentation updated (if behavior changed)
- [ ] Manual testing completed
- [ ] No secrets committed (.env files, API keys, credentials)
- [ ] Build passes (`npm run build` in Frontend directory)
```

### PR Guidelines

- **Keep PRs focused.** One PR per feature or fix. Avoid bundling unrelated changes.
- **Write a clear title.** Use the same `type(scope): summary` format as commits when possible.
- **Describe the "why".** Explain the motivation and context, not just what changed.
- **Test before submitting.** Run the frontend build and manually verify the affected flow.
- **Respond to feedback.** Address review comments promptly. Push fixes as new commits (do not force-push during review).

### Review Process

- PRs are reviewed by the maintainer ([Shasu Vathanan](https://github.com/shasu1pm)).
- Small fixes and documentation changes may be merged quickly.
- Feature PRs may require discussion in the linked issue before implementation.

---

## Issue Templates

### Bug Report

When filing a bug report, include the following information:

```markdown
## Bug Report

**Summary:** Brief description of the bug.

**Steps to Reproduce:**
1. Go to ...
2. Paste URL ...
3. Click ...
4. See error

**Expected Behavior:** What should happen.

**Actual Behavior:** What actually happens.

**Logs / Error Messages:**
<!-- Paste browser console logs, backend terminal output, or network errors -->

**Environment:**
- OS: (e.g., Windows 11, macOS 14, Ubuntu 22.04)
- Browser: (e.g., Chrome 120, Firefox 121)
- Node.js version: (e.g., 18.19.0)
- Python version: (e.g., 3.11.7)

**Screenshots:** (if applicable)
```

### Feature Request

When proposing a new feature, include the following:

```markdown
## Feature Request

**Problem:** What problem does this feature solve? Why is it needed?

**Proposed Solution:** How would you like it to work? Describe the ideal behavior.

**Alternatives Considered:** What other approaches did you consider? Why were they not chosen?

**Additional Context:** Any mockups, examples, links, or references.
```

### General Guidelines for Issues

- Search existing issues before creating a new one to avoid duplicates.
- Use descriptive titles: "Download fails for videos over 30 minutes at 720p" is better than "Download broken".
- Add relevant labels if you have access (bug, enhancement, documentation, question).

---

## Lint and Build Commands

VoxText AI does not currently have automated test suites. Use the following commands to verify your changes:

### Frontend

```bash
cd Frontend

# Install dependencies
npm install

# Run the development server (manual testing)
npm run dev

# Build for production (type checking + bundling)
npm run build
```

The `npm run build` command runs the TypeScript compiler and Vite build. A successful build confirms there are no type errors and the bundle compiles correctly. **Always run this before submitting a PR.**

### Backend

```bash
cd Backend

# Install dependencies
pip install -r requirements.txt

# Start the server (manual testing)
python server.py
```

Verify the backend by hitting the metadata endpoint:

```bash
curl "http://127.0.0.1:5000/api/metadata?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

A valid JSON response with video title, duration, and language confirms the backend is working.

> **Note:** Automated tests (Jest for frontend, pytest for backend) are planned for a future release. See [Roadmap.md](Roadmap.md) for details.

---

## Code Style Guidelines

### General Principles

- **Follow existing patterns.** When in doubt, look at how similar code is structured in the project and match that style.
- **Keep it simple.** Avoid over-engineering. This is a focused tool, not a framework.
- **No unnecessary dependencies.** Before adding a new npm package or pip dependency, consider whether the functionality can be achieved with existing tools or a small amount of custom code.

### Frontend (React + TypeScript)

- Use **Tailwind CSS** for all styling. Do not introduce CSS modules, styled-components, or other CSS-in-JS solutions.
- Use **TypeScript** for all new code. Avoid `any` types where possible.
- Use **functional components** with hooks. Do not use class components.
- Use **Radix UI** primitives for accessible interactive components (dialogs, dropdowns, tooltips).
- Keep state management simple with `useState` and `useRef`. Do not introduce Redux, Zustand, or other state libraries without discussion.
- Use **Motion (Framer Motion)** for animations, consistent with the existing codebase.

### Backend (Flask + Python)

- Follow **PEP 8** style conventions.
- Use type hints where practical for function signatures.
- Keep endpoint handlers focused: extract reusable logic into helper functions.
- Use `yt-dlp` options consistently with the existing patterns in `server.py`.
- Clean up temporary files. Use `tempfile.mkdtemp()` and ensure cleanup happens even on error paths.

### Documentation

- Use Markdown for all documentation files.
- Follow the existing header format: title, purpose, audience, last updated, version.
- Use tables for structured comparisons and checklists for actionable items.
- Link to related documents at the bottom of each file.

---

## Security Reporting

If you discover a security vulnerability in VoxText AI:

1. **Do NOT open a public issue.** Security vulnerabilities should not be disclosed publicly until a fix is available.
2. **Contact the maintainer directly.** Reach out to [Shasu Vathanan](https://github.com/shasu1pm) via GitHub private message or by opening a [GitHub Security Advisory](https://docs.github.com/en/code-security/security-advisories/working-with-repository-security-advisories/creating-a-repository-security-advisory) on the repository.
3. **Provide details.** Include a clear description of the vulnerability, steps to reproduce, and potential impact.
4. **Allow time for a fix.** Practice responsible disclosure. Give the maintainer reasonable time (typically 30-90 days) to address the issue before any public disclosure.
5. **Do NOT commit secrets.** Never include API keys, credentials, `.env` files, or authentication tokens in commits, PRs, or issue descriptions.

We take security seriously and appreciate responsible reporting.

---

## Recognition

Contributors who submit accepted pull requests will be acknowledged in release notes. Significant contributions (features, major fixes, documentation overhauls) will be highlighted specifically.

We value every contribution, whether it is code, documentation, bug reports, feature suggestions, or helping other users in discussions.

---

## Related Documents

- [README](README.md) — Project overview and navigation hub
- [Setup Guide](Setup-Guide.md) — Full development environment setup instructions
- [Roadmap](Roadmap.md) — Planned milestones and feature direction
- [Architecture](Architecture.md) — System architecture and technical decisions
- [API](API.md) — API reference for backend endpoints
- [Security and Privacy](Security-Privacy.md) — Security practices and data handling
- [LICENSE](LICENSE) — MIT License
