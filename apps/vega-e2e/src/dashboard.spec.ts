import { test, expect } from '@playwright/test';

test('loads the dashboard from Sirius', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('Welcome to Sirius');
});

test('serves the dashboard API through the frontend proxy', async ({
  request,
}) => {
  const response = await request.get('/api/dashboard');
  expect(response.ok()).toBeTruthy();
  expect(await response.json()).toEqual({ message: 'Welcome to Sirius' });
});

test('when Vega home is clicked, should preserve the unsaved todo draft', async ({
  page,
}) => {
  await page.goto('/dashboard');
  const draft = page.getByLabel('New todo', { exact: true });
  await draft.fill('Unsaved draft');

  await page.getByRole('link', { name: 'Vega home' }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(draft).toHaveValue('Unsaved draft');
});

test('when the theme is toggled, should persist the selection after reload', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/dashboard');
  const toggle = page.getByRole('button', { name: 'Dark theme' });
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');

  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();

  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
