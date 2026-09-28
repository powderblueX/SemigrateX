/** The migration recipe supported by the first public development slice. */
export type RecipeId = 'commonjs-to-esm';

/** Syntax categories that require inspection during a CommonJS migration. */
export type FindingKind =
  | 'require-call'
  | 'module-exports-assignment'
  | 'exports-property-assignment'
  | 'commonjs-path-global';

/** A source location uses one-based coordinates suitable for editors and GitHub links. */
export interface SourceLocation {
  readonly file: string;
  readonly line: number;
  readonly column: number;
}

/** A finding records syntax evidence; it does not assert that an edit is safe. */
export interface MigrationFinding {
  readonly kind: FindingKind;
  readonly location: SourceLocation;
  readonly symbol: string;
  readonly action: 'manual-review';
}

/** Portable output from the read-only planning phase. */
export interface MigrationPlan {
  readonly schemaVersion: 1;
  readonly recipe: RecipeId;
  readonly repository: {
    readonly root: string;
    readonly scannedFiles: number;
  };
  readonly findings: readonly MigrationFinding[];
  readonly summary: {
    readonly totalFindings: number;
    readonly filesWithFindings: number;
  };
}

/** Inputs accepted by the repository scanner. */
export interface PlanRequest {
  readonly repositoryRoot: string;
  readonly recipe?: RecipeId;
}
