import { test, expect } from '@playwright/test';

test.describe('QR Code Ordering', () => {
  test('should detect table ID and link orders correctly', async ({ page }) => {
    // Simulate scanning a QR code
    await page.goto('/menu/8'); // Example URL with table ID

    // Verify table ID is detected
    const menuItem = await page.locator('._menuItem_1bx3l_1').first();
    await menuItem.click();
    await page.waitForTimeout(1000)
    const addToCartButton = await page.locator('._addToCartButton_1uf66_140').first();
    await addToCartButton.click();
    await page.waitForTimeout(1000)
    const checkout = await page.locator('._showOrdersButton_1kyg6_181').first();
    await checkout.click();
    const tableInput = await page.locator('#tableNumber').first();
    await expect(tableInput).toHaveValue('8');
    await page.waitForTimeout(1000)
    const procceed = await page.locator('._orderButton_3ee1k_35').first();
    await procceed.click();
  });
});