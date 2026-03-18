/// Import from Playwright
import { test as baseTest, expect as baseExpect } from '@playwright/test';

///Variable arranged for convenience and login credentials
const BASE_URL = process.env.BASE_URL = 'http://localhost:8080/';
const USERNAME = process.env.USERNAME = 'Mehyo(Unrelated)';
const PASSWORD = process.env.PASSWORD = '12345678';

const test = baseTest;
const expect = baseExpect;


/// BeforeEach for setting up Tests
test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.title.includes('@no-auth')) {
    return; //skip login for this test
  }
  console.log(`Running ${testInfo.title}`);

  await page.goto(BASE_URL);
  await page.fill('#username.input', USERNAME);
  await page.fill('#password.input', PASSWORD);
  await page.getByRole('button', { name: 'LOGIN' }).click();
});

/// afterEach for Teardown
test.afterEach(async ({ context }) => {
  // Close any extra windows/tabs opened by the test.
  // (Playwright usually closes the test page/context automatically, but this guarantees cleanup.)
  const pages = context.pages();
  await Promise.allSettled(pages.map((p) => p.close()));
});

/// Exports
export { test, expect, BASE_URL, USERNAME, PASSWORD };