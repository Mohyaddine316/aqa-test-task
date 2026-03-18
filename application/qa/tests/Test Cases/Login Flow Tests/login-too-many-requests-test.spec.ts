/// Import from Base Test
import { test, expect, BASE_URL, USERNAME, PASSWORD } from '../../Base Test/base-test';


/// Test Case: Too Many Requests
test.describe('too many requests', { tag: '@tmr' }, () => {
    test('Too Many Requests @no-auth', async ({ page }) => {
      
      // Track all login API requests and responses
      const loginRequests: any[] = [];
      const loginResponses: any[] = [];
      
      // Set up request/response tracking
      page.on('request', request => {
        if (request.url().includes('/login')) { // Adjust to match your login endpoint
          loginRequests.push({
            url: request.url(),
            method: request.method(),
            payload: request.postDataJSON(),
            timestamp: Date.now()
          });
        }
      });
      
      page.on('response', async response => {
        if (response.url().includes('/login')) {
          const status = response.status();
          let responseBody;
          try {
            responseBody = await response.json();
          } catch {
            responseBody = null;
          }
          
          loginResponses.push({
            url: response.url(),
            status: status,
            body: responseBody,
            timestamp: Date.now()
          });
          
          console.log(`Login API response status: ${status}`);
        }
      });
      
      // Attempt multiple logins
      const maxAttempts = 20;
      let tooManyRequestsTriggered = false;
      
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        console.log(`Login attempt ${attempt} of ${maxAttempts}`);
        
        await page.goto(BASE_URL);
        await page.fill('#username.input', USERNAME);
        await page.fill('#password.input', '1234569');
        await page.getByRole('button', { name: 'LOGIN' }).click();
        
        // Check if rate limit was triggered
        const tooManyRequestsElement = page.getByText('Too Many Requests');
        if (await tooManyRequestsElement.isVisible()) {
          console.log(`✓ Rate limit triggered after ${attempt} attempts`);
          tooManyRequestsTriggered = true;
          break;
        }
        
        // Small delay between attempts
        await page.waitForTimeout(500);
      }
  
       // Verify rate limit was triggered
       expect(tooManyRequestsTriggered).toBeTruthy();
      
      // Validate the API call history
      console.log(`Total login API requests: ${loginRequests.length}`);
      console.log(`Total login API responses: ${loginResponses.length}`);
      
      // Find the rate limit response (status 429)
      const rateLimitResponse = loginResponses.find(r => r.status === 429);
      expect(rateLimitResponse).toBeDefined();
      
      // Verify the sequence of responses
      const responseStatuses = loginResponses.map(r => r.status);
      console.log('Response status sequence:', responseStatuses);
      
      // The last response should be 429 (rate limit)
      expect(responseStatuses[responseStatuses.length - 1]).toBe(429);
      
      // Verify UI message
      await expect(page.getByText('Too Many Requests')).toBeVisible();
    });
  });