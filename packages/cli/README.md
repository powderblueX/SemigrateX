# @semigratex/cli

The CLI exposes migration planning to developers and scripts. Build the workspace from the repository root, then run:

```sh
node packages/cli/dist/cli.js plan examples/commonjs-app
node packages/cli/dist/cli.js plan /path/to/repository --output plan.json
```

`--output` creates a new file and refuses to replace an existing plan. Standard output is JSON when no output path is provided.
