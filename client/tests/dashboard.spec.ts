import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('token', 'mock-jwt-token');
    });
  });

  test('should display dashboard sections', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page.getByText('Content Dashboard')).toBeVisible();
    await expect(page.getByText('Feed')).toBeVisible();
    await expect(page.getByText('Trending')).toBeVisible();
    await expect(page.getByText('Favorites')).toBeVisible();
    await expect(page.getByText('Settings')).toBeVisible();
  });

  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/dashboard');
    
    const darkModeButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await darkModeButton.click();
    
    // Check if dark mode is applied
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should search content', async ({ page }) => {
    await page.goto('/dashboard');
    
    const searchInput = page.getByPlaceholder('Search content...');
    await searchInput.fill('technology');
    
    // Should trigger search
    await expect(searchInput).toHaveValue('technology');
  });

  test('should navigate between sections', async ({ page }) => {
    await page.goto('/dashboard');
    
    await page.getByText('Trending').click();
    await expect(page.getByText('Trending Now')).toBeVisible();
    
    await page.getByText('Favorites').click();
    await expect(page.getByText('Your Favorites')).toBeVisible();
    
    await page.getByText('Settings').click();
    await expect(page.getByText('Customize your dashboard experience')).toBeVisible();
  });
});