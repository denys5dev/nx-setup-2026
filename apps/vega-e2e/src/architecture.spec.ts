import { ESLint } from 'eslint';
import { workspaceRoot } from '@nx/devkit';
import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';

const cases = [
  ['libs/shared/dashboard/contracts', '@nestjs/common', true],
  ['libs/shared/dashboard/contracts', '@angular/core', true],
  ['libs/shared/dashboard/contracts', '@ngrx/store', true],
  ['libs/vega/dashboard/domain', '@nestjs/common', true],
  ['libs/shared/ui/design-system', '@nestjs/common', true],
  ['libs/sirius/dashboard/domain', '@angular/core', true],
  ['libs/sirius/dashboard/domain', '@ngrx/store', true],
  ['libs/sirius/shell', '@celestial/shared/ui/design-system', true],
  ['libs/vega/dashboard/ui/dashboard', '@ngrx/store', true],
  ['libs/vega/dashboard/feature/dashboard-page', '@angular/common/http', true],
  ['libs/vega/dashboard/domain', '@ngrx/store', false],
  ['libs/sirius/dashboard/domain', '@nestjs/common', false],
  ['libs/vega/shell', '@celestial/shared/ui/design-system', false],
  [
    'libs/vega/dashboard/ui/dashboard',
    '@celestial/shared/dashboard/contracts',
    false,
  ],
] as const;

for (const [project, dependency, forbidden] of cases) {
  test(`when ${project} imports ${dependency}, should ${forbidden ? 'reject' : 'allow'} the dependency`, async () => {
    const eslint = new ESLint({ cwd: resolve(workspaceRoot, project) });

    const [result] = await eslint.lintText(
      `import * as dependency from '${dependency}'; export { dependency };`,
      { filePath: 'src/lib/architecture-probe.ts' },
    );

    expect(result.messages.map(({ ruleId }) => ruleId)).toEqual(
      forbidden
        ? [
            project.includes('/feature/')
              ? 'no-restricted-imports'
              : '@nx/enforce-module-boundaries',
          ]
        : [],
    );
  });
}
