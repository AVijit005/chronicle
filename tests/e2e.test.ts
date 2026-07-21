import { test, expect } from '@playwright/test';

test.describe('Chronicle E2E', () => {
  test('dashboard loads without crashing', async ({ page }) => {
    await page.goto('http://localhost:5000/app');
    
    // Wait for the ShimmerSkeleton or actual content to appear
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot of the dashboard
    await page.screenshot({ path: 'artifacts/dashboard.png' });
    
    // Verify there is no 'mock' data fallback visible (like "Interstellar")
    const bodyText = await page.locator('body').innerText();
    
    expect(bodyText).not.toContain('Interstellar');
  });

  test('analytics loads without crashing', async ({ page }) => {
    await page.goto('http://localhost:5000/app/analytics');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ path: 'artifacts/analytics.png' });
    
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain('Succession');
  });
});
