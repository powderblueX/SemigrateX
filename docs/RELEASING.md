# Release process

SemigrateX is not yet published to npm. Packages remain private until the first supported migration recipe and compatibility policy are ready.

## Preparation

1. Confirm the target package names and ownership of the npm scope.
2. Verify the working tree and run `pnpm install --frozen-lockfile` and `pnpm run check`.
3. Check the README's feature claims against the current CLI and package exports.
4. Update [CHANGELOG.md](../CHANGELOG.md) with user-visible changes and limitations.
5. Run the example and at least one external repository scenario from a clean environment.
6. Check the package contents with a dry-run pack before changing a package's `private` field.

## Publication

Tag releases as `vMAJOR.MINOR.PATCH` after the package artifacts have been verified. Publish only approved packages, then check installation and the documented commands from outside this workspace. Announce incompatible plan-schema changes with a migration guide. Do not imply that an unpublished or unimplemented adapter is available.
