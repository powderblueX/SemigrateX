# SemigrateX

SemigrateX is an open-source workbench for repository-scale code migrations. It aims to turn framework upgrades, dependency changes, and API replacements into plans and changes that developers can inspect, resume, and review.

The product uses deterministic analysis and transformations first. Agent assistance is planned for cases where a migration rule cannot decide the correct change from syntax and type information alone. Parallel agents are an execution option for independent work units, not a requirement for using the product.

> **Project status:** early development, version 0.1.0. The current CLI only creates a read-only CommonJS-to-ESM inspection plan. It does not edit files, run an Agent, or guarantee that every CommonJS construct is detected.

## What works today

- Scan JavaScript and TypeScript source files using the TypeScript parser.
- Locate `require(...)`, `module.exports`, `exports.name`, `__dirname`, and `__filename` syntax.
- Produce a versioned JSON plan with repository-relative paths and editor-friendly line/column locations.
- Publish the [version 1 plan schema](schemas/migration-plan.v1.schema.json) for downstream consumers.
- Skip dependency and generated directories, and refuse to overwrite an existing output file.

## Quick start

Requirements: Node.js 22.19 or newer and pnpm 11.7.0.

```sh
pnpm install
pnpm run build
pnpm run plan:example
```

Run against another repository:

```sh
node packages/cli/dist/cli.js plan /absolute/path/to/repository
node packages/cli/dist/cli.js plan /absolute/path/to/repository --output migration-plan.json
```

Without `--output`, the CLI writes only JSON to standard output. With `--output`, it creates a new file. The input repository is never modified by the current command.

## Intended workflow

```text
Inspect repository → plan impact → run deterministic recipes → inspect remaining compiler errors
                   → request Agent help for ambiguous changes → review → commit
```

Only the inspection step is implemented. The remaining steps are milestones, documented in [ROADMAP.md](ROADMAP.md). [docs/PRODUCT.md](docs/PRODUCT.md) defines the intended user experience and success measures.

## Architecture

The initial workspace has a small dependency graph:

```text
@semigratex/cli → @semigratex/core → TypeScript parser
```

The core package owns migration data and code analysis. Runtime adapters, including a future DeepSeek Harness plugin and an MCP server, will depend on the core; the core will not depend on an Agent runtime. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [ADR 0001](docs/decisions/0001-independent-core.md).

## Why a separate repository

SemigrateX is an independent project. DeepSeek Harness is the preferred first Agent runtime for later phases, while the CLI and core must remain useful without it. This keeps project releases, contribution history, and compatibility decisions under SemigrateX's own governance.

## Documentation

- [Product definition](docs/PRODUCT.md)
- [Architecture and package ownership](docs/ARCHITECTURE.md)
- [Roadmap](ROADMAP.md) and [current tasks](TODO.md)
- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Release process](docs/RELEASING.md)

## Contributing and support

The repository is open for focused issues and pull requests. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before contributing. Report suspected vulnerabilities through the private reporting instructions in [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE). Copyright © 2026 powderblueX.
