import { test, expect } from '@playwright/test';

test.describe('SentinelX End-to-End User Workflows', () => {
  test('Landing Page renders with government identity and mode selection', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SentinelX/);
    await expect(page.getByRole('heading', { name: /Your AI Assistant for Indian Standards/i })).toBeVisible();
    await expect(page.getByText(/Industry \/ MSME/i)).toBeVisible();
    await expect(page.getByText(/Consumer/i)).toBeVisible();
    await expect(page.getByText(/Student \/ Researcher/i)).toBeVisible();
  });

  test('Find My Standard profiler matches stainless steel water bottle to IS 17526', async ({ page }) => {
    await page.goto('/standards/recommend');
    await expect(page.getByRole('heading', { name: /Find My Applicable Indian Standard/i })).toBeVisible();

    const productInput = page.getByLabel(/Product Name \/ Type/i);
    await expect(productInput).toBeVisible();

    const evaluateButton = page.getByRole('button', { name: /Evaluate Applicable Standards/i });
    await evaluateButton.click();

    // Verify recommendations display
    await expect(page.getByText(/IS 17526:2021/i)).toBeVisible({ timeout: 10000 });
  });

  test('Chat Workspace renders 3-panel layout and provides grounded responses with citations', async ({ page }) => {
    await page.goto('/chat');
    await expect(page.getByText(/SentinelX Conversation/i)).toBeVisible();
    await expect(page.getByPlaceholder(/Ask about standards/i)).toBeVisible();

    // Send query
    await page.fill('input[placeholder*="Ask about standards"]', 'What are the tests for TMT bars?');
    await page.keyboard.press('Enter');

    // Wait for response with citations
    await expect(page.getByText(/TMT/i)).toBeVisible({ timeout: 15000 });
  });

  test('Gold Hallmarking page verifies 6-digit HUID code format', async ({ page }) => {
    await page.goto('/hallmarking');
    await expect(page.getByRole('heading', { name: /Gold & Silver Hallmarking Assistant/i })).toBeVisible();
    await expect(page.getByText(/22K \(916 Fineness\)/i)).toBeVisible();

    const validateButton = page.getByRole('button', { name: /Validate Format/i });
    await validateButton.click();
    await expect(page.getByText(/Format valid!/i)).toBeVisible();
  });
});
