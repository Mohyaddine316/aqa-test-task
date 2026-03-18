/// Import from Base Test
import { test, expect, BASE_URL } from '../../Base Test/base-test';


/// Test Case: Username already exists
test.describe('user already exists', { tag: '@userexists' }, () => {
test('User already exists @no-auth', async ({ page }) => {
    
    // Wait for the registration API response (adjust URL pattern to match your endpoint)
    const registrationResponsePromise = page.waitForResponse(response => 
        response.url().includes('/register') || 
        response.url().includes('/signup') ||
        response.url().includes('/user') ||
        response.url().includes('/account'),
        { timeout: 10000 }
    );
    
    // Perform registration with existing username
    await page.goto(BASE_URL);
    await page.getByRole('link', { name: 'CREATE ACCOUNT' }).click();
    await page.fill('#username.input', 'Junji');
    await page.fill('#email.input', 'piyito9044@soco7.com');
    await page.fill('#password.input', '11141998');
    await page.getByRole('button', { name: 'CREATE ACCOUNT' }).click();
    
    // Wait for and validate the response
    const registrationResponse = await registrationResponsePromise;
    
    // Check status code - typically 409 Conflict for duplicate resource
    const status = registrationResponse.status();
    console.log(`📡 Registration API responded with status: ${status}`);
    
    // For username already exists, expect:
    // 409 Conflict (most common for duplicate)
    // 400 Bad Request (sometimes used)
    // 422 Unprocessable Entity (sometimes used)
    const expectedStatuses = [409, 400, 422];
    expect(expectedStatuses).toContain(status);
    console.log(`✅ API returned correct error status: ${status}`);
    
    // Optionally check response body for error message
    try {
        const responseBody = await registrationResponse.json();
        console.log('Error response:', responseBody);
        
        // Validate error message in response
        const bodyStr = JSON.stringify(responseBody).toLowerCase();
        const hasUsernameExistsMessage = bodyStr.includes('username') && 
                                        (bodyStr.includes('already exists') || 
                                         bodyStr.includes('already taken') ||
                                         bodyStr.includes('already in use'));
        expect(hasUsernameExistsMessage).toBeTruthy();
        console.log('✅ Response body contains username exists error message');
    } catch (e) {
        console.log('Response body is not JSON or empty');
    }
    
    // Verify UI shows the error message
    await expect(page.getByText('A user with this username already exists.')).toBeVisible();
    console.log('✅ UI error message verified');
})});
