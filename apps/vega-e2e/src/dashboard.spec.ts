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
