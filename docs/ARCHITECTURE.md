# Architecture

## Current implementation

The repository is a pnpm workspace with two packages:

| Package | Owner | Dependencies |
|---|---|---|
| `@semigratex/core` | Plan data model, source traversal, syntax inspection | TypeScript compiler API |
| `@semigratex/cli` | Arguments, terminal output, optional plan-file creation | Core |

The dependency direction is `CLI → Core`. The core cannot import CLI, an Agent runtime, an MCP host, or a web application. A future DeepSeek Harness integration will be an adapter that consumes the same core APIs as the CLI.

## Planning data

`MigrationPlan` is a versioned JSON document described by [the version 1 schema](../schemas/migration-plan.v1.schema.json). Version 1 contains a recipe ID, repository scan statistics, source findings, and a summary. Paths are repository-relative and use `/` on all platforms. Positions are one-based. The root path records where the plan was created and is local machine data; users should review a plan before sharing it.

The scanner reads regular files with JavaScript or TypeScript extensions and skips symlinks and common dependency/build directories. It parses syntax with the TypeScript compiler API, so occurrences inside comments or strings are not reported. It currently recognizes syntax patterns, not resolved symbols or runtime behavior. A locally defined `require`, dynamic export, generated code in an unusual directory, or a malformed file can produce incomplete results. All findings therefore require manual review.

## Intended owner boundaries

These modules are planned, not present in the first release:

| Future module | Proposed responsibility |
|---|---|
| Code intelligence | Resolve symbols, references, package boundaries, and evidence levels |
| Recipe SDK | Declare supported versions, preconditions, transformations, and validation |
| Transaction engine | Preview and apply an edit set in an isolated worktree; record rollback data |
| Validation | Attribute compiler and package-check results to migration steps |
| Agent adapter | Send only unresolved semantic cases to an Agent under scoped permissions |
| Review UI | Display impact, edit provenance, diffs, and user decisions |

Do not create empty packages for these modules. Split a package when it has a real consumer, an independent reason to change, and a tested public interface.

## Future write safety

A future apply command must verify the repository and revision against the plan, preview every edit, protect the original checkout, and persist the result before presenting success. If the state is uncertain after interruption, it must report that uncertainty and request review before retrying a side effect. Git worktrees and commits are expected implementation tools, not substitutes for those checks.

## Runtime adapters

DeepSeek Harness is the preferred first Agent runtime. Its adapter will translate a SemigrateX work unit into DSH tools, sessions, and events. The adapter owns compatibility with DSH releases. It cannot add DSH types or lifecycle assumptions to the core data model. An MCP surface may expose inspection and recipe actions to other clients using the same core behavior.

## Verification strategy

Focused tests cover scanner behavior, CLI JSON, and output-file safety. Later edit-capable phases need fixture-based transformation tests, real-repository case studies, interrupted-run recovery checks, and validation on supported platform combinations. A benchmark is evidence for a feature, not the product itself.
