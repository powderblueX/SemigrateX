# Repository instructions

SemigrateX is a TypeScript monorepo for source-code migration tooling. Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) before changing package boundaries or adding a runtime adapter.

## Working rules

- Keep `packages/core` independent of DeepSeek Harness, MCP, web UI, and CLI-specific behavior.
- Treat migration plans as versioned data. Add a new schema version for incompatible serialized changes; do not silently reinterpret an existing field.
- The planning command is read-only. Any future write command must provide a preview, a repository identity check, explicit user authorization, and a recovery path.
- Source locations are one-based and paths in plans are relative to the repository root with `/` separators.
- Avoid secrets in generated plans. Do not include source text or environment values unless a future feature explicitly requests them with redaction.
- Prefer a maintained parser/compiler over regular-expression parsing of code.
- Document exported APIs with JSDoc that states behavior, inputs, outputs, and important failure conditions. Comments should explain constraints or non-obvious decisions, not paraphrase each statement.
- Keep user-visible feature claims aligned with implemented behavior.
- Add focused tests for changed behavior and update the relevant package README and architecture or product documentation when a public behavior changes.

## Verification

```sh
pnpm install --frozen-lockfile
pnpm run check
```

Do not run migration commands against a user's working tree during tests. Use temporary fixtures and remove only test-created data.
