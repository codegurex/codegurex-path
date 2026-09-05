# Contributing to CodeGurex Path

Build understanding before adding tools. Keep explanations accurate, concise and
welcoming. Avoid offensive branding, exaggerated claims and instructions to test
systems without authorization.

## Development

Use Node 22.13+ (22.x) or Node 24+, then run:

```sh
npm ci
npm run build
npm test
npm run dev
npm pack --dry-run
```

Run `npm run check` before submitting a change. Test both a modern terminal and
`--plain` mode. For storage experiments, set `CODEGUREX_PATH_HOME` to an absolute
temporary directory you own. Never run tests against a learner's real progress.

## Adding lessons

1. Add a lesson in the appropriate `src/content/` catalog using the `LessonSeed` type.
2. Keep module and lesson IDs stable, lowercase and hyphenated; saved progress uses them.
3. Include an explanation, practical motivation, original example, key concepts,
   authorized practice, expected observation and a conceptual question with feedback.
4. Make alternatives for operating systems explicit. Exercises are displayed only.
5. Use localhost, synthetic data or an explicitly authorized local lab. Do not add
   arbitrary Internet targets, credential collection or automatic command execution.
6. Validate the curriculum and add tests for new behavior. If lesson counts change,
   consider how existing quiz records and schema versions will migrate; do not silently
   discard user state.

Keep content outside UI components. Translate text through locale catalogs without
translating stable IDs. The future i18n work must finish extracting command/help copy
and add a locale-aware content loader before offering another language in settings.

## Code and pull requests

- Keep TypeScript strict; prefer explicit domain types over `any`.
- Separate terminal presentation, learning logic, content and persistence.
- Add a dependency only when it provides a clear benefit.
- Explain the user-visible change, why it is needed and how it was checked.
- Cover failure paths and state preservation when changing persistence.
- Avoid unrelated formatting changes and preserve useful existing code.
- Do not publish packages or introduce telemetry, remote backends or install scripts.

Treat contributors respectfully. Discuss the code and evidence, avoid personal attacks,
and never include real credentials or private learner data in an issue or pull request.

## Release review

Before a maintainer publishes: verify npm name ownership, review package contents,
run the cross-platform CI matrix, audit dependencies, check the license and test the
generated tarball in a separate directory. Publishing is a deliberate maintainer action;
there is no automatic release workflow.
