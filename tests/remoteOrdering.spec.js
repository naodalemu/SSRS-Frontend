import { test, expect } from '@playwright/test';

test.describe('Remote Ordering', () => {
    test('should queue orders and delay processing until arrival is confirmed', async ({ page }) => {
      // Simulate remote ordering
      await page.goto('/menu');
      const menuItem = await page.locator('._menuItem_1bx3l_1').first();
      await menuItem.click();
      await page.waitForTimeout(1000)
      const addToCartButton = await page.locator('._addToCartButton_1uf66_140').first();
      await addToCartButton.click();
      await page.waitForTimeout(1000)
      const checkout = await page.locator('._showOrdersButton_1kyg6_181').first();
      await checkout.click();
      await page.waitForTimeout(1000)
      const remoteButton = await page.locator('._orderOptions_3ee1k_144 > label').nth(1);
      await remoteButton.click();
      await page.waitForTimeout(1000)
      const procceed = await page.locator('._orderButton_3ee1k_35').first();
      await procceed.click();
      await page.waitForTimeout(1000)
      await page.goto('/orders');
  
      // Confirm arrival
      const fillTable = await page.locator('#tableNumber');
      await fillTable.fill('1');
      const arrivalButton = await page.locator('._actionButton_17c1n_203').first();
      await expect(arrivalButton).toBeVisible();
      await arrivalButton.click();
    });
  });