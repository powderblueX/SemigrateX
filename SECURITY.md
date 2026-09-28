# Security policy

## Supported versions

SemigrateX is in early development and has no published stable release. Security fixes are applied to the current default branch; older commits are not maintained.

## Reporting

Do not open a public issue for a suspected vulnerability. After the GitHub repository is created and private vulnerability reporting is enabled, use the repository's **Security → Report a vulnerability** entry. Until that entry is available, contact the repository owner privately through the contact method on [powderblueX's GitHub profile](https://github.com/powderblueX). If no private contact is available, do not post exploit details publicly; ask for a private reporting channel in a minimal public issue.

Include the affected version or commit, reproduction steps, impact, and whether the issue involves untrusted source files, paths, process execution, or generated plans. Do not include real secrets or third-party private code.

## Current trust boundary

The v0.1 `plan` command reads local repository files and creates a JSON report. It does not execute project code or modify the input repository. Generated reports can contain local absolute paths; review them before sharing. Future write and Agent features will require separate threat-model and permission review before release.
