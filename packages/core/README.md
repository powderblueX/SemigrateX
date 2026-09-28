# @semigratex/core

`@semigratex/core` owns the read-only migration plan and its versioned JSON data model. The first slice detects CommonJS syntax in JavaScript and TypeScript repositories. It does not transform source files or start an Agent.

```ts
import { planMigration } from '@semigratex/core';

const plan = await planMigration({ repositoryRoot: '/path/to/repository' });
```

The package is private during the initial development phase. The public API will be reviewed before an npm release.
