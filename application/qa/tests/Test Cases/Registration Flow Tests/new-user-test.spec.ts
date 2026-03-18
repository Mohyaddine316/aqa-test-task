/// Import from Base Test
import { test, expect, BASE_URL } from '../../Base Test/base-test';


/// Test Case: New User Registers to the platform
test.describe('New User registration', { tag: '@newuser' }, () => {
test('Test User Registration @no-auth', async ({ page }) => {
    
    // Wait for the registration API response (adjust URL pattern to match your endpoint)
    const registrationResponsePromise = page.waitForResponse(response => 
        response.url().includes('/register') || 
        response.url().includes('/signup') ||
        response.url().includes('/user') ||
        response.url().includes('/account') ||
        response.url().includes('/create-account'),
        { timeout: 10000 }
    );
    
    // Perform registration with new user credentials
    await page.goto(BASE_URL);
    await page.getByRole('link', { name: 'CREATE ACCOUNT' }).click();
    await page.fill('#username.input', 'James');
    await page.fill('#email.input', 'idabk99012@minitts.net');
    await page.fill('#password.input', '09876543');
    await page.getByRole('button', { name: 'CREATE ACCOUNT' }).click();
    
    // Wait for and validate the response
    const registrationResponse = await registrationResponsePromise;
    
    // Check status code - for successful creation, expect:
    // 200 OK (if returns user data)
    // 201 Created (most common for successful resource creation)
    // 302 Redirect (if redirects to login/dashboard)
    const status = registrationResponse.status();
    console.log(`📡 Registration API responded with status: ${status}`);
    
    // For successful registration, expect 201, 200, or 302
    const successStatuses = [200, 201, 302, 304];
    expect(successStatuses).toContain(status);
    console.log(`✅ API returned successful status: ${status}`);
    
    // Optional: check response body for user data
    if (status !== 302) { // Don't try to parse redirects
        try {
            const responseBody = await registrationResponse.json();
            console.log('Success response:', responseBody);
            
            // Validate response contains user data
            if (responseBody.user || responseBody.id || responseBody.username) {
                console.log('✅ Response contains user data');
                
                // Check for specific fields
                if (responseBody.username === 'James') {
                    console.log('✅ Username matches');
                }
                if (responseBody.email === 'idabk99012@minitts.net') {
                    console.log('✅ Email matches');
                }
            }
            
            // Check for auth token if applicable
            if (responseBody.token || responseBody.access_token) {
                console.log('✅ Auth token received');
            }
        } catch (e) {
            console.log('Response body is not JSON or empty (may be redirect)');
        }
    } else {
        console.log('✅ Redirect detected - registration successful');
        
        // Get redirect location
        const location = registrationResponse.headers()['location'];
        if (location) {
            console.log(`Redirect location: ${location}`);
        }
    }
    
    // Verify UI shows successful login/overview page
    await expect(page.getByText('Overview')).toBeVisible();
    console.log('✅ UI verified with "Overview" text');
})});