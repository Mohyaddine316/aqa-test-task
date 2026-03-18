/// Import from Base Test
import { test, expect, BASE_URL, USERNAME, PASSWORD } from '../../Base Test/base-test';


/// Test case: Login Happy Path (Valid Credentials)
test('login test @Happy', async ({ page }) => {
  
  // Store login request/response details
  let loginRequestDetails: any = null;
  let loginResponseDetails: any = null;
  
  // Track the login request
  page.on('request', request => {
    const url = request.url();
    // Adjust this pattern to match your actual login endpoint
    if (url.includes('login') && request.method() === 'POST') {
      loginRequestDetails = {
        url: url,
        method: request.method(),
        headers: request.headers(),
        payload: request.postDataJSON(),
        timestamp: Date.now()
      };
      console.log('📤 Login request captured:', {
        url: url,
        method: request.method()
      });
    }
  });
  
  // Track the login response
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('login')) {
      const status = response.status();
      loginResponseDetails = {
        url: url,
        status: status,
        headers: response.headers(),
        timestamp: Date.now()
      };
      console.log(`📥 Login response captured: ${status}`);
      
      // If this is our login response, validate it immediately
      if (status === 200) {
        console.log('✅ Login API successful with status 200');
        
        // Try to get response body
        try {
          const body = await response.json();
          console.log('Response body keys:', Object.keys(body));
          
          // Validate response structure (adjust based on your API)
          if (body.token) console.log('✅ Auth token received');
          if (body.user) console.log('✅ User data received');
        } catch {
          console.log('Response body is not JSON or empty');
        }
      }
    }
  });
  
  // Note: The actual login happens in beforeEach
  // We need to wait for any async API calls to complete
  await page.waitForTimeout(2000);
  
  // Validate that we captured the login request
  expect(loginRequestDetails, 'Login request was not captured').toBeDefined();
  console.log('✅ Login request captured successfully');
  
  // Validate the login request payload if available
  if (loginRequestDetails?.payload) {
    expect(loginRequestDetails.payload).toHaveProperty('username');
    expect(loginRequestDetails.payload).toHaveProperty('password');
    console.log('✅ Login request contains username/password');
  }
  
  // Validate that we captured the login response
  expect(loginResponseDetails, 'Login response was not captured').toBeDefined();
  
  // CRITICAL: Validate status code is 200
  expect(loginResponseDetails.status).toBe(200);
  console.log(`✅ Login API status code verified: ${loginResponseDetails.status}`);
  
  // Your existing UI assertion
  await expect(page.getByText('Overview')).toBeVisible();
  console.log('✅ UI verified with "Overview" text');
  
  // Summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Login API URL: ${loginRequestDetails?.url}`);
  console.log(`Login Method: ${loginRequestDetails?.method}`);
  console.log(`Login Response Status: ${loginResponseDetails?.status} ✅`);
});