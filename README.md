# Celestial

Angular frontend **Vega** and NestJS backend **Sirius**, generated with Nx.
Use Node 24.15+ (24.x) and pnpm 12.8.1 (pinned in `package.json`).
Run `nvm use` when using nvm.

```sh
pnpm install
pnpm prepare             # activate Git hooks after the first install
pnpm nx serve vega         # starts Vega :4200 and Sirius :3000
pnpm nx serve sirius       # backend only, when needed
```

Vega redirects `/` to `/dashboard` and loads a summary and todo CRUD example from Sirius.
Its development server proxies `/api/**` to port 3000. Configure the same
reverse proxy in production; the development proxy is not part of the build.

```sh
pnpm nx run-many -t build lint typecheck test
pnpm exec playwright install chromium
pnpm nx e2e vega-e2e
pnpm nx graph
```

Playwright starts both apps and checks the browser page and HTTP API.
Unit tests use Vitest throughout: Angular's native runner for Vega, Nx's Analog
integration for non-buildable Angular libraries, and `@nx/vitest` for Nest.
See [Nx's Vitest documentation](https://nx.dev/docs/technologies/test-tools/vitest/introduction).

## Structure

```text
apps/
  vega/                       bootstrap, root providers and outlet
  sirius/                     bootstrap, root module
  vega-e2e/                   full-stack Playwright tests
libs/
  vega/
    shared/domain/            shared frontend models and reusable services
    shell/                    application routes; lazy domain-shell loading
    dashboard/
      shell/                  dashboard routes and domain providers
      feature/dashboard-page/ store-connected parent component
      ui/dashboard/           presentation component and events
      domain/
        src/lib/store/        actions, reducer, selectors, effects
        src/lib/application/  dashboard workflows
        src/lib/infrastructure/ HTTP data service
  sirius/
    shell/                    API module composition
    dashboard/
      api/                    controllers and request validation
      domain/
        src/lib/application/  dashboard service
        src/lib/infrastructure/ todo repository
  shared/dashboard/contracts/ framework-free HTTP types
  shared/ui/design-system/    SCSS components and Storybook
```

Application code and feature composition live in libraries; apps bootstrap shells.
Configuration, static assets, global styles, and bootstrap tests also belong with their apps.
Nx project identifiers include scope and layer (`sirius-dashboard-api`) because
they must be unique across the workspace. Source filenames do not repeat that
prefix. Module classes distinguish API and domain to make composition readable.

## Architecture and imports

This follows the reference project's application shell, domain shell, feature/UI,
and API/domain boundaries.
Internal libraries are non-buildable: each application's bundler compiles its
dependencies. Nx tags and ESLint enforce frontend/backend separation and these
layer dependencies:

```text
Sirius app → sirius/shell → dashboard/api → dashboard/domain
Vega app → vega/shell → dashboard/shell (lazy)
                           ├─ feature/dashboard-page → domain
                           │                         → ui/dashboard
                           └─ domain providers
UI → other UI, shared domain models and framework-free utilities/contracts
```

Apps may import only shell libraries. Shells compose shells, features, API,
domain, UI and utilities. Features depend on domain, UI and utilities; UI can
import scoped shared domain models, but cannot import feature domains, NgRx or
HTTP. Scope tags also prevent Vega/Sirius cross-imports.
These rules apply to library public APIs, with ESLint enforcing the dependencies.
ESLint also rejects NestJS imports in Vega and UI libraries, Angular/NgRx imports
in Sirius, and all three frameworks in utilities/contracts. Sirius cannot depend
on UI or feature libraries. Playwright runs import-boundary regression checks.

Use named exports in each library's `src/index.ts` for its small public API.
Use direct relative imports inside that library, never its own barrel. Import
other libraries through their public aliases; do not deep-import their files.
There are no umbrella barrels or nested folder barrels. Keep the dashboard
shell import dynamic so the feature and its domain stay in a separate route chunk.

Barrels do not automatically prevent tree shaking. Side effects, eager imports,
and overly broad public APIs cause trouble. Export only what consumers need,
use `export type` for types, and keep infrastructure implementations private.

The `domain` name follows the reference's pragmatic usage: it includes application
services and infrastructure, so it is not a framework-free DDD domain. Keep
presentation in named `ui/` libraries and store-connected parents in named
`feature/` libraries. Colocate each component with its template, styles and tests.
Add `entities/` when domain behavior needs it; avoid empty placeholder layers.

If business rules become substantial, separate a pure domain from application
orchestration and infrastructure, and enforce those dependencies as separate Nx
projects. Folders alone do not enforce dependency direction within a library.
Shared API contracts live in `shared/dashboard/contracts`; never import
Nest services or persistence models into Vega.

The workspace uses Nx's integrated TypeScript path setup because the Angular
generator does not support the initial TypeScript solution/project-reference
setup. Aliases are generated by Nx. pnpm manages the root dependency manifest;
these internal libraries are not independently published packages.

## Generate another feature

```sh
pnpm nx g @nx/nest:library libs/sirius/orders/domain --name=sirius-orders-domain --importPath=@celestial/sirius/orders/domain --unitTestRunner=vitest --tags=scope:sirius,type:domain --no-interactive
pnpm nx g @nx/nest:library libs/sirius/orders/api --name=sirius-orders-api --importPath=@celestial/sirius/orders/api --unitTestRunner=vitest --tags=scope:sirius,type:api --no-interactive
pnpm nx g @nx/angular:library libs/vega/orders/shell --name=vega-orders-shell --importPath=@celestial/vega/orders/shell --standalone=false --skipModule --unitTestRunner=none --tags=scope:vega,type:shell --no-interactive
pnpm nx g @nx/angular:library libs/vega/orders/feature/orders-page --name=vega-orders-feature-orders-page --importPath=@celestial/vega/orders/feature/orders-page --prefix=v --unitTestRunner=vitest-analog --tags=scope:vega,type:feature --no-interactive
pnpm nx g @nx/angular:library libs/vega/orders/ui/orders --name=vega-orders-ui-orders --importPath=@celestial/vega/orders/ui/orders --prefix=v --unitTestRunner=vitest-analog --tags=scope:vega,type:ui --no-interactive
```

Keep generated source names short (`orders.controller.ts`, `orders.ts`). Register
the frontend domain providers and feature routes in its shell, lazy-load that
shell from `vega/shell`, and import backend API modules from `sirius/shell`.
Keep generated lint and typecheck targets consistent with existing libraries.

## Frontend layers

`DashboardPage` connects NgRx Store to the stateless `Dashboard` view. The view
receives `DashboardModel` from `vega/shared/domain/models` and emits typed user
intentions; it owns no NgRx actions, store, HTTP calls, or mutable state.
The parent maps those intentions to
`DashboardPageActions`. The selector explicitly returns the shared model, so UI
and feature domain code share its contract without depending on each other.
`Store.selectSignal` reads the Redux store; it is not SignalStore.

The domain library owns:

- `store/dashboard.actions.ts`: page intentions and API outcomes.
- `store/dashboard.reducer.ts`: normalized todos plus loading, error, and editor state.
- `store/dashboard.selectors.ts`: derived counts and the model.
- `store/dashboard.effects.ts`: request concurrency, action mapping and error recovery.
- `application/dashboard.service.ts`: dashboard loading and CRUD workflows, including title normalization.
- `infrastructure/dashboard.data.service.ts`: HTTP methods and endpoint URLs.
- `dashboard.providers.ts`: feature state/effect registration, consumed by the dashboard shell route.

`provideStore()` is registered once in Vega. The dashboard shell registers feature
state and effects through its lazy routes, following [Nx's standalone feature registration pattern](https://nx.dev/blog/using-ngrx-standalone-apis-with-nx)
with the current `ngrx-feature-store` generator and NgRx 22 APIs.
[Angular recommends presentation-focused components](https://angular.dev/style-guide);
[NgRx Effects isolate asynchronous work](https://ngrx.io/guide/effects).

This follows the reference project's domain/store and domain/infrastructure
layout. Store effects call application services; application services own workflows
and call infrastructure data services. Infrastructure owns HTTP details and does
not depend on the store. API contracts are shared; frontend models and state
stay frontend-only.

The reducer keeps editor drafts to make this example's view stateless. A reusable
form may instead own ephemeral form state; moving every focus/hover interaction
into the global store would add noise. Drafts and loaded state survive route
re-entry during the current app session. Refreshing the browser resets frontend
state and reloads the server data.

Effects allow one request at a time across load and mutations so an older load
cannot overwrite a successful mutation. Controls are disabled while pending.
Mutations update entities only on server confirmation; failures retain drafts and
existing data. Add per-operation concurrency when parallel editing is needed.
ESLint rejects direct HTTP imports from feature, application, and store code, and
rejects infrastructure imports from store code.

Sirius validates requests in `api`, executes CRUD in the domain application
service, and stores data in the infrastructure repository. The example repository
is process-local memory: it resets on backend restart and is not shared across
instances. Replace it with database persistence before relying on durable data.

| Endpoint                          | Operation                               |
| --------------------------------- | --------------------------------------- |
| `GET /api/dashboard`              | Summary                                 |
| `GET /api/dashboard/todos`        | List todos                              |
| `GET /api/dashboard/todos/:id`    | Read a todo                             |
| `POST /api/dashboard/todos`       | Create (`title`)                        |
| `PATCH /api/dashboard/todos/:id`  | Rename or toggle (`title`, `completed`) |
| `DELETE /api/dashboard/todos/:id` | Delete                                  |

## Test style

Unit tests cover one behavior per test with one assertion, using blank lines to
separate arrange, act, and assert. Parameterized tests are appropriate for the
same rule over several inputs. Reducers, selectors, effects, and presentation are
tested independently. Playwright scenarios exercise complete user journeys and
therefore may contain several assertions.

## Design system

```sh
pnpm nx storybook design-system
pnpm nx build-storybook design-system
```

Use `v-` selectors for Vega and `ds-` for the shared design system. Components use
matching `.ts`, `.html`, and `.scss` filenames. Angular 22 defaults to OnPush.

## Commits

Husky runs commitlint on `commit-msg`. Use Conventional Commits, for example:

```text
feat(vega): add dashboard filters
fix(sirius): handle missing dashboard data
chore: update dependencies
feat(api)!: change dashboard response
```

The conventional commitlint preset defines the accepted types; scopes are optional.
See https://www.conventionalcommits.org/en/v1.0.0/. `pnpm prepare` activates hooks
in a fresh checkout. Pull request CI also checks commit messages, including when
local hooks were skipped. Make the CI job required in branch protection to enforce
it before merging.
