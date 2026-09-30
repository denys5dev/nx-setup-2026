# Architecture Findings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Resolve all six findings from the repository architecture review.

**Architecture:** Apps bootstrap application shells. Vega's dashboard shell composes domain providers and a named page feature; the feature maps plain UI events to NgRx actions. UI libraries cannot depend on domain or NgRx.

**Tech Stack:** Existing Nx, Angular, NgRx, NestJS, Vitest, Playwright, ESLint.

**Spec:** The six findings in this conversation, accepted by the user with “fix all p findings”.

## Global Constraints

- Preserve `/dashboard`, `/api/dashboard`, todo CRUD, draft retention, and request ordering.
- Reuse installed dependencies and Nx generators; keep libraries non-buildable.
- Preserve contracts and the existing backend API/domain split.
- Work in the current shared workspace; leave changes uncommitted for review.

## Review Focus

- Root redirect and lazy route provider registration: existing full-stack dashboard test.
- UI events reaching the correct store actions: page component interaction tests.
- Failed mutations retaining drafts: existing effect/reducer tests and retry browser test.
- Backend dependency injection through the shell: existing app module test.
- Boundary bypasses: lint probes for app→feature/domain and UI→NgRx/domain imports.

### Task 1: Shell ownership

- [x] Generate `libs/vega/shell`, `libs/vega/dashboard/shell`, and `libs/sirius/shell`.
- [x] Move application routes into `vegaShellRoutes`, feature routes into `dashboardShellRoutes`, and API composition into `SiriusShellModule`.
- [x] Wire apps to shells; preserve lazy dashboard loading and domain providers.

### Task 2: Feature/UI separation

- [x] Move the feature to `libs/vega/dashboard/feature/dashboard-page` with Nx.
- [x] Generate `libs/vega/dashboard/ui/dashboard`; move Dashboard and its tests/template/styles there.
- [x] Define a UI-owned `DashboardView` interface and semantic outputs. Map outputs to NgRx actions in DashboardPage.
- [x] Adapt presentation tests and add page event-mapping coverage.

### Task 3: Enforcement and documentation

- [x] Add shell tags/constraints; restrict apps to shells and UI external imports from NgRx/HTTP.
- [x] Keep generated project targets and TypeScript paths consistent with existing projects.
- [x] Update README structure, dependency guidance, and generation examples.
- [x] Format the repository, including `apps/vega-e2e/tsconfig.json`.

### Verification

- [x] Run Nx lint/typecheck/unit tests and builds, plus Storybook build.
- [x] Run Playwright full-stack tests and boundary probes.
- [x] Run Nx formatting check and inspect the final diff.

## Results

- Fresh baseline: 25 lint/typecheck/test tasks passed before structural changes.
- Semantic create-output regression failed before implementation, then passed.
- Final Nx gate: 37 tasks passed across 13 projects (27 fresh, 10 cached).
- All 5 Playwright full-stack tests passed.
- 10 ESLint import probes confirmed allowed and forbidden dependencies.
- Repository formatting and whitespace checks passed.
- Independent review found no remaining findings.
- No runtime behavior changes, new dependencies, or commits.
