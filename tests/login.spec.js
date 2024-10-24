import { test, expect } from '@playwright/test';

test('login user and create post successfully', async ({ page }) => {

    // LOGIN
    await page.goto('https://www.campusvoices.us/login');

    await page.fill('input[name="username"]', 'teste2e');
    await page.fill('input[name="password"]', 'inin123.');

    await page.click('button[type="submit"]');

    await page.waitForNavigation();

    await expect(page).toHaveURL('https://www.campusvoices.us');
    await expect(page.locator('text=Latest Posts')).toBeVisible();

    // CREATE POST
    await page.click('.new-post');

    await page.fill('input[name="post-title"]', 'This is a title test from Playwright.');
    await page.fill('textarea[name="post-body"]', 'This is a body test from Playwright.');

    await page.click('button[type="submit"]');

    await page.waitForSelector('.post-list');

    await expect(page.locator('text=This is a title test from Playwright.')).toBeVisible();
});