import { test, expect } from '@playwright/test';

test.describe('Order Modification', () => {
    test('should allow editing in pending state', async ({ page }) => {
      // Navigate to orders page
      await page.goto('/orders/80');
      
  
      // Edit an order
      const quantityInput = page.locator('._upperButton_1pkr6_104').first();
      await quantityInput.click();
      const saveButton = page.locator('._orderButton_1pkr6_29').first();
      await saveButton.click();
      const message = page.locator('._MessageContainer_1u9uh_1 > div').first();
      await expect(message).toHaveText(/Order updated successfully!/);
    });
  });