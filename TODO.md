# Current tasks

This file tracks near-term work. The [roadmap](ROADMAP.md) owns longer-term milestones.

## Next release

- [ ] Select the first complete migration recipe using real issues and repositories.
- [ ] Document the chosen recipe's supported source and target versions.
- [ ] Add a parser diagnostic field so malformed source is reported explicitly.
- [ ] Detect shadowed `require` and CommonJS globals before classifying findings.
- [ ] Record repository Git revision and dirty state without changing the checkout.
- [ ] Add a human-readable `plan` view alongside the JSON output.

## Before first public package publication

- [ ] Confirm GitHub, npm scope, domain, and trademark availability for SemigrateX.
- [ ] Remove `private: true` only from packages approved for publication.
- [ ] Define package compatibility and deprecation rules.
- [ ] Add package provenance and dry-run publication checks.
- [ ] Enable GitHub private vulnerability reporting and branch protection.
- [ ] Create a release tag and verify installation from a clean environment.
