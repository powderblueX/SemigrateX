# Contributing

Thanks for helping improve SemigrateX. Issues with a reproducible repository and a concrete migration goal are especially useful at this stage.

## Before coding

Open an issue for a new recipe, data-model change, or package boundary change. State the source and target versions, representative repositories, and what success would mean. Small fixes can go directly to a focused pull request.

## Local setup

```sh
pnpm install --frozen-lockfile
pnpm run check
pnpm run plan:example
```

Node.js 22.19 or newer and pnpm 11.7.0 are required. Keep changes focused and include the smallest test that demonstrates changed behavior. Update public API documentation and the owning package README when behavior changes.

## Pull requests

Describe the user problem, implementation, verification performed, and limitations. Link an issue when one exists. A proposed migration recipe must include real source/target version boundaries and at least one public or redistributable example; do not submit a rule based only on a synthetic fixture.

Maintainers may request a narrower change before merging. Do not include secrets, private repository content, or migration plans containing local path information in a public issue or pull request.

## Conduct and security

Follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Report suspected vulnerabilities privately using [SECURITY.md](SECURITY.md).
