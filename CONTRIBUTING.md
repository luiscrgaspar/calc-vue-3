# Contributing

Thanks for contributing to this project. The priority is to keep the calculator
simple, testable, and easy to review.

## Local Setup

Install dependencies:

```bash
yarn install
```

Run the app locally:

```bash
yarn start
```

Run common checks:

```bash
yarn lint
yarn test --runInBand
yarn test:coverage
yarn build
yarn test:visual
```

Refresh visual baselines intentionally:

```bash
yarn test:visual:update
```

## Development Guidelines

- Keep changes small and focused on the goal of the PR.
- Follow the separation described in `docs/ARCHITECTURE.md`.
- Put mathematical and formatting rules in pure services.
- Keep minimal state in Vuex and avoid translated messages in the store.
- Update every file in `src/locales` when adding visible text.
- Do not version generated artifacts such as `coverage/` and `dist/`.
- Avoid refactors that are unrelated to the current fix or feature.

## Testing Guidelines

Choose the test level based on the risk of the change:

- Components: rendering, events, props, i18n, and Vuex integration.
- Services: math rules, formatting, errors, and edge cases.
- Store: getters, mutations, and actions.
- Playwright: browser rendering, screenshots, and cross-state visual regressions.

When changing calculations, include success cases and at least one relevant
edge or error case. When changing UI, validate observable behavior instead of
implementation details.

## Pull Request Review Workflow

Before merging a pull request, keep the branch in a reviewable state:

- Run `yarn lint`.
- Run `yarn test --runInBand`.
- Run `yarn test:coverage` when the change affects logic, components, or the
  store.
- Run `yarn build` before merging changes that affect production code or
  configuration.
- Keep generated artifacts such as `coverage/` and `dist/` out of commits.

PRs should include:

- A short description of the change.
- The reason for the change.
- The validation commands that were run.
- Screenshots or notes when the UI changes.
- Any known limitation or follow-up that should not block the PR.

## CodeRabbit Comments

CodeRabbit comments should be treated as review input, not automatic truth.
Each comment should be checked against the current code before making changes.

Recommended handling:

- Fix `critical` and `major` findings before merge when they are valid.
- Fix `minor` findings when the change is low risk or improves correctness.
- Treat `nitpick` findings as optional unless they simplify code or add useful
  test coverage.
- Skip comments that would introduce product changes outside the PR scope, but
  leave a short explanation in the PR.
- After fixing a thread, push a commit and mark the thread as resolved.

When asking Codex to handle CodeRabbit feedback, use:

```text
check the CodeRabbit comments and fix/respond to them
```

Codex should then:

1. Fetch PR comments and review threads.
2. Separate valid issues from noise.
3. Apply minimal fixes for valid comments.
4. Run the relevant validation commands.
5. Commit and push fixes to the PR branch.
6. Resolve addressed review threads.

## Commit Guidance

Prefer small commits with clear messages, for example:

```text
Address CodeRabbit review comments
Improve calculator service coverage
Document architecture decisions
```

Avoid mixing unrelated refactors with bug fixes unless the refactor is required
for the fix.

## Branch Hygiene

- Start from an up-to-date base branch before opening a PR.
- Keep generated files out of the diff.
- Prefer one topic per branch.
- Re-run relevant validation after resolving review feedback.
- If a review comment is intentionally skipped, explain why in the PR thread.
