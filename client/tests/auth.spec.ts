import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login form by default', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
  });

  test('should switch to register form', async ({ page }) => {
    await page.goto('/');
    
    await page.getByText('Create one here').click();
    
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
    await expect(page.getByText('What happens next?')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/');
    
    await page.getByPlaceholder('Enter your email').fill('invalid-email');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await expect(page.getByText('Invalid email address')).toBeVisible();
  });

  test('should show password requirements on register', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Create one here').click();
    
    await page.getByPlaceholder('Enter your email').fill('test@example.com');
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    // Should show success message
    await expect(page.getByText('Check Your Email')).toBeVisible();
  });
});