<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

## Unit test naming

- Use the tested class name for class suites, for example `describe(Dashboard.name, () => { ... })`.

- Name every unit test case (`it`, `test`, and parameterized variants) using `when <condition or action>, should <expected behavior>`. Use lowercase `when` and `should`, separated by a comma.
- Example: `it('when getDepositCheck is called, should trigger getDepositCheck on the data service', () => { ... });`
- Describe the actual setup or trigger and the behavior asserted by the test. Keep `describe` suite names focused on the class, function, or module under test.
- Apply this convention when adding or updating unit tests.

## Angular version

- This workspace uses Angular 22. Follow Angular 22 APIs and defaults.
- `OnPush` change detection is the default in Angular 22; do not add redundant `changeDetection: ChangeDetectionStrategy.OnPush` declarations or imports.
- Use NgRx for application state management, including shared UI state such as the theme. Components select state and dispatch actions; reducers handle state changes and effects handle side effects such as persistence.
