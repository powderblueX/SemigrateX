# Roadmap

This roadmap describes intended work, not released functionality. Milestone dates are planning targets and may change with user feedback.

## Phase 1: inspect and plan (months 1–3)

- [x] Independent workspace, CLI, versioned plan data, and a read-only CommonJS syntax scanner.
- [ ] Identify project configuration, package boundaries, and selected dependency versions.
- [ ] Add a symbol/reference provider and a migration impact graph for TypeScript projects.
- [ ] Distinguish direct evidence from inferred impact in the plan.
- [ ] Ship one complete, documented migration recipe selected from real repository demand.
- [ ] Validate on at least five external repositories and publish limitations.

## Phase 2: controlled migration (months 4–6)

- [ ] Introduce deterministic recipes with preview and reviewable edits.
- [ ] Run edits in an isolated Git worktree and record a reproducible change manifest.
- [ ] Classify compiler errors and attribute them to migration steps.
- [ ] Add resume/cancel semantics and durable task records.
- [ ] Build a web review interface for impact, diffs, and unresolved cases.

## Phase 3: Agent assistance and ecosystem (months 7–9)

- [ ] Integrate DeepSeek Harness through a separately versioned adapter.
- [ ] Escalate only unresolved semantic changes to an Agent with scoped tools.
- [ ] Add an MCP interface for analysis and migration plans.
- [ ] Define recipe authoring, compatibility, and distribution rules.
- [ ] Measure deterministic-only, Agent-only, and hybrid workflows on the same tasks.

## Phase 4: reliability and public release (months 10–12)

- [ ] Support a second language or framework family after the first reaches practical quality.
- [ ] Publish reproducible migration case studies on real open-source repositories.
- [ ] Complete release automation, documentation, and compatibility policy.
- [ ] Invite external recipes and contributors; respond to user-reported failures.
- [ ] Evaluate whether research results merit a software-engineering paper.

## Exit criteria for a 1.0 release

- A new user can install and run a supported recipe from the published documentation.
- Every source change is previewable, attributed, and recoverable.
- A failed or interrupted task leaves the original checkout usable.
- At least one migration family has documented results on public repositories.
- CLI and exported package APIs have versioned compatibility expectations.
