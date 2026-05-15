# Contributing to TaskFlow

Thank you for your interest in improving TaskFlow! This guide explains how to contribute in a way that keeps the repository clean and professional.

## Branching strategy

- `main` — production-ready code
- `feature/*` — new features and enhancements
- `fix/*` — bug fixes
- `chore/*` — maintenance and minor cleanup

Create a branch from `main` before you start working:

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

## Commit messages

Use clear, concise commit titles and include context when needed.

Good example:
```bash
git commit -m "Add sidebar filters to task list"
```

## Pull requests

When your feature is ready:

1. Push your branch: `git push origin feature/your-feature-name`
2. Open a pull request to `main`
3. Add a description of the change and any testing notes
4. Link the issue if one exists

## Code quality

- Keep code style consistent with existing files
- Run tests before opening a PR
- Ensure there are no large generated or temporary files committed

## Local development

Install dependencies for all packages:

```bash
npm run install:all
```

Start both frontend and backend together:

```bash
npm run dev
```

Run backend tests:

```bash
cd server && npm test
```

## Reporting issues

If you find a bug, use the issue templates in `.github/ISSUE_TEMPLATE/` to share:

- `bug_report.md`
- `feature_request.md`

Include:
- What happened
- How to reproduce it
- What you expected to happen
- Screenshots or logs if available
