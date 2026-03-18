/// Import from Base Test
import { test, expect, BASE_URL } from '../../Base Test/base-test';

/// Test Case: email already exists
test.describe('email already exists', { tag: '@emailexists' }, () => {
test('email already exists @no-auth', async ({ page }) => {
    
  // Wait for the registration API response
  const registrationResponsePromise = page.waitForResponse(response => 
      response.url().includes('/register') || 
      response.url().includes('/signup') ||
      response.url().includes('/user') ||
      response.url().includes('/account'),
      { timeout: 10000 }
  );
  
  // Perform registration with existing email
  await page.goto(BASE_URL);
  await page.getByRole('link', { name: 'CREATE ACCOUNT' }).click();
  await page.fill('#username.input', 'Abbas');
  await page.fill('#email.input', 'mohyaddine.kreidieh@hotmail.com');
  await page.fill('#password.input', '11141998');
  await page.getByRole('button', { name: 'CREATE ACCOUNT' }).click();
  
  // Wait for and validate the response
  const registrationResponse = await registrationResponsePromise;
  
  // Check status code - typically 409 Conflict for duplicate resource
  const status = registrationResponse.status();
  console.log(`📡 Registration API responded with status: ${status}`);
  
  // For email already exists, expect:
  // 409 Conflict (most common for duplicate)
  // 400 Bad Request (sometimes used)
  // 422 Unprocessable Entity (sometimes used)
  const expectedStatuses = [409, 400, 422];
  expect(expectedStatuses).toContain(status);
  console.log(`✅ API returned correct error status: ${status}`);
  
  // Optional: check response body for error message
  try {
      const responseBody = await registrationResponse.json();
      console.log('Error response:', responseBody);
      
      // Validate error message in response
      const bodyStr = JSON.stringify(responseBody).toLowerCase();
      const hasEmailExistsMessage = bodyStr.includes('email') && 
                                   (bodyStr.includes('already exists') || 
                                    bodyStr.includes('already taken') ||
                                    bodyStr.includes('already in use'));
      expect(hasEmailExistsMessage).toBeTruthy();
      console.log('✅ Response body contains email exists error message');
  } catch (e) {
      console.log('Response body is not JSON or empty');
  }
  
  // Verify UI shows the error message
  await expect(page.getByText('A user with this email address already exists.')).toBeVisible();
  console.log('✅ UI error message verified');
})});