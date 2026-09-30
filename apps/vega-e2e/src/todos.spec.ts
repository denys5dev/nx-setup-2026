import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';

const endpoint = '/api/dashboard/todos';

test('creates, renames, completes, reopens, and deletes a todo through the UI', async ({
  page,
  request,
}) => {
  const title = `Plan release ${randomUUID()}`;
  const renamed = `Ship release ${randomUUID()}`;
  let id: string | undefined;
  try {
    await page.goto('/dashboard');
    await expect(page.getByRole('status')).toHaveText('Welcome to Sirius');
    await page.getByLabel('New todo', { exact: true }).fill(title);
    const created = page.waitForResponse(
      (response) =>
        response.url().endsWith(endpoint) &&
        response.request().method() === 'POST',
    );
    await page.getByRole('button', { name: 'Add todo', exact: true }).click();
    const response = await created;
    expect(response.status()).toBe(201);
    id = (await response.json()).id;
    let row = page.getByRole('listitem').filter({ hasText: title });
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'Edit', exact: true }).click();
    await page.getByLabel('Edit todo', { exact: true }).fill(renamed);
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    row = page.getByRole('listitem').filter({ hasText: renamed });
    await row.getByRole('button', { name: 'Complete', exact: true }).click();
    await expect(
      row.getByRole('button', { name: 'Reopen', exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(
      row.getByRole('button', { name: 'Reopen', exact: true }),
    ).toBeVisible();
    expect(await (await request.get(`${endpoint}/${id}`)).json()).toMatchObject(
      { title: renamed, completed: true },
    );
    await row.getByRole('button', { name: 'Reopen', exact: true }).click();
    await expect(
      row.getByRole('button', { name: 'Complete', exact: true }),
    ).toBeVisible();
    await row.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(row).toHaveCount(0);
    expect((await request.get(`${endpoint}/${id}`)).status()).toBe(404);
  } finally {
    if (id) await request.delete(`${endpoint}/${id}`);
  }
});

test('keeps a failed create draft and allows retry', async ({
  page,
  request,
}) => {
  const title = `Retry task ${randomUUID()}`;
  let id: string | undefined;
  try {
    await page.goto('/dashboard');
    await expect(page.getByRole('status')).toHaveText('Welcome to Sirius');
    await page.route(`**${endpoint}`, (route) =>
      route.request().method() === 'POST'
        ? route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: '{}',
          })
        : route.continue(),
    );
    await page.getByLabel('New todo', { exact: true }).fill(title);
    await page.getByRole('button', { name: 'Add todo', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText(
      'Unable to create todo',
    );
    await expect(page.getByLabel('New todo', { exact: true })).toHaveValue(
      title,
    );
    await page.unroute(`**${endpoint}`);
    const created = page.waitForResponse(
      (response) =>
        response.url().endsWith(endpoint) &&
        response.request().method() === 'POST',
    );
    await page.getByRole('button', { name: 'Add todo', exact: true }).click();
    id = (await (await created).json()).id;
    await expect(
      page.getByRole('listitem').filter({ hasText: title }),
    ).toBeVisible();
    await expect(page.getByRole('alert')).toHaveCount(0);
    await expect(page.getByLabel('New todo', { exact: true })).toHaveValue('');
  } finally {
    if (id) await request.delete(`${endpoint}/${id}`);
  }
});

test('rejects malformed API input and returns proper missing-resource statuses', async ({
  request,
}) => {
  expect(
    (await request.post(endpoint, { data: { title: '   ' } })).status(),
  ).toBe(400);
  expect(
    (
      await request.post(endpoint, {
        data: { title: 'Valid', completed: true },
      })
    ).status(),
  ).toBe(400);
  expect((await request.get(`${endpoint}/not-a-uuid`)).status()).toBe(400);
  expect((await request.get(`${endpoint}/${randomUUID()}`)).status()).toBe(404);
  const created = await request.post(endpoint, {
    data: { title: '  Validate me  ' },
  });
  expect(created.status()).toBe(201);
  const todo = await created.json();
  try {
    expect(todo).toMatchObject({ title: 'Validate me', completed: false });
    expect(
      (
        await request.patch(`${endpoint}/${todo.id}`, {
          data: { completed: 'yes' },
        })
      ).status(),
    ).toBe(400);
    expect(
      (await request.patch(`${endpoint}/${todo.id}`, { data: {} })).status(),
    ).toBe(400);
    expect(await (await request.get(`${endpoint}/${todo.id}`)).json()).toEqual(
      todo,
    );
  } finally {
    expect((await request.delete(`${endpoint}/${todo.id}`)).status()).toBe(204);
  }
});
