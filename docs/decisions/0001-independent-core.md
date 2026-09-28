# ADR 0001: Keep the migration core independent of Agent runtimes

Status: accepted, 2026-09-28.

## Context

The first target runtime is DeepSeek Harness. Its plugin architecture and existing LSP navigation make it a useful host for Agent-assisted migration. The product also needs a simple CLI entry point and should remain usable if runtime APIs change.

## Decision

Migration plans, recipes, code intelligence, and edit transactions belong to SemigrateX-owned packages. DeepSeek Harness integration belongs in a downstream adapter. The CLI uses the same core APIs without starting an Agent.

## Consequences

Core behavior can be tested and released independently. The adapter must translate lifecycle and permission concepts explicitly, which adds code but limits the effect of upstream changes. The initial release ships only the core and CLI; no empty adapter package is created.
