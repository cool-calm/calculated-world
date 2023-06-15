import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5888/');
  await expect(page).toHaveTitle("Calculated.World");
});

test('increment button', async ({ page }) => {
  await page.goto('http://localhost:5888/');

  const incrementButton = page.getByRole('button', { name: 'Increment' });
  const output = page.getByRole('status');
  
  const wasmHTML = page.locator('//wasm-html[1]');
  await expect(wasmHTML.locator(output)).toHaveText('0');

  await wasmHTML.locator(incrementButton).click();

  await expect(wasmHTML.locator(output)).toHaveText('1');


  // Click the get started link.
  // await page.getByRole('link', { name: 'Get started' }).click();

  // Expects the URL to contain intro.
  // await expect(page).toHaveURL(/.*intro/);
});
