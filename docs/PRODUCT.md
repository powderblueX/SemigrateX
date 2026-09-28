# Product definition

## Problem

Framework and dependency migrations often require changes across source files, package manifests, configuration, examples, and public APIs. A codemod can reliably handle known syntax changes but cannot decide every application-specific case. An unconstrained coding Agent may edit too broadly or make it difficult to explain why each change was made.

## Users

The primary user is a developer responsible for upgrading a JavaScript or TypeScript repository. Secondary users are maintainers publishing migration recipes and reviewers approving migration pull requests. The first supported workflow should remain useful to a developer working alone on a local checkout.

## Product promise

SemigrateX turns a migration request into a versioned plan and, in later releases, a reviewable set of changes. Every proposed change should have an owner, source evidence, a transformation method, and a validation result. The tool must make uncertainty visible rather than silently treating an Agent guess as a verified conversion.

## Intended user journey

1. Select a repository and a supported migration recipe.
2. Inspect affected symbols, files, configuration, and unsupported cases.
3. Preview deterministic transformations in an isolated worktree.
4. Review unresolved cases and authorize scoped Agent assistance if desired.
5. Inspect diffs and validation output before accepting commits or a pull request.
6. Resume an interrupted task from recorded state.

Version 0.1 implements only the read-only inspection portion of step 2 for CommonJS syntax.

## Success measures

The project will measure supported-repository completion rate, human edits required after a run, incorrect edit rate, time and model cost, interruption recovery, and whether external developers can install and use a recipe without maintainer help. Counts from self-made fixtures alone do not establish product value.

## Scope decisions

- Initial language family: JavaScript and TypeScript.
- Initial runtime surface: local CLI; a DeepSeek Harness adapter is planned after the core workflow is stable.
- Multi-Agent execution is appropriate only when independent work units and a safe integration path have been identified.
- The first public recipe must name specific source and target versions. A claim to migrate arbitrary frameworks or versions is out of scope.
