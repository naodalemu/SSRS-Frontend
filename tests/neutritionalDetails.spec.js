import { test, expect } from '@playwright/test';

test.describe('Nutritional and Allergen Information', () => {
    test('should display nutritional details and allow allergen removal', async ({ page }) => {
      // Navigate to menu
      await page.goto('/menu');
  
      // Select a menu item
      const menuItem = await page.locator('._menuItem_1bx3l_1').first();
      await menuItem.click();
      
      // Verify nutritional details are displayed
      const nutritionalInfo = await page.locator('._modal_1uf66_1').first();
      await expect(nutritionalInfo).toBeVisible();
      await expect(nutritionalInfo).toHaveText(/Cal/);
  
      // Remove allergenic ingredient
      const allergenCheckbox = await page.locator('label[for="ingredient-1"]');
      await allergenCheckbox.click();
  
      // Verify allergen is removed
      const excludedIngredients = await page.locator('#ingredient-1');
      await expect(excludedIngredients).toBeChecked();
    });
  });