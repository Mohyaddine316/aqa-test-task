/// Import from Base Test
import { test, expect, BASE_URL, USERNAME, PASSWORD } from '../../Base Test/base-test';


/// Test Login sad Path (Invalid Credentials)
test.describe('sad', { tag: '@sad' }, () => {
    test('login sad path test @no-auth', async ({ page }) => {
        
        // Wait for the login API response (adjust URL pattern to match your endpoint)
        const loginResponsePromise = page.waitForResponse(response => 
            response.url().includes('/login') || 
            response.url().includes('/auth') ||
            response.url().includes('/signin'),
            { timeout: 10000 }
        );
        
        // Perform login action
        await page.goto(BASE_URL);
        await page.fill('#username.input', USERNAME);
        await page.fill('#password.input', '1234569');
        await page.getByRole('button', { name: 'LOGIN' }).click();
        
        // Wait for and validate the response
        const loginResponse = await loginResponsePromise;
        
        // Check that status code is 401 (Unauthorized) or 403 (Forbidden)
        const status = loginResponse.status();
        console.log(`🔑 Login API responded with status: ${status}`);
        
        // For invalid credentials, expect 401 or 403
        expect([401, 403]).toContain(status);
        console.log(`✅ API returned correct error status code: ${status}`);
        
        // Optionally check response body for error message
        try {
            const responseBody = await loginResponse.json();
            console.log('Error response:', responseBody);
            
            // Validate error message in response if present
            if (responseBody.message) {
                expect(responseBody.message.toLowerCase()).toContain('wrong username');
            }
        } catch (e) {
            console.log('Response body is not JSON or empty');
        }
        
        // Verify UI shows the error message
        await expect(page.getByText('Wrong username or password.')).toBeVisible();
        console.log('✅ UI error message verified');
    });
});