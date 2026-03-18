/// Import from Base Test
import { test, expect } from '../../Base Test/base-test';


/// Test Case: Create a New Project
test('Create new project @createproject', async ({ page }) => {
    
    // Wait for the project creation API response
    // Adjust URL patterns to match your actual API endpoints
    const projectCreationPromise = page.waitForResponse(response => 
        response.url().includes('/projects') || 
        response.url().includes('/api/project') ||
        response.url().includes('/project/create'),
        { timeout: 10000 }
    );
    
    // Navigate to Projects page and create new project
    await page.getByRole('link', { name: 'Projects' }).click(); 
    // Use exact match to avoid strict-mode collisions with similarly-named links.
    await page.getByRole('link', { name: /^New project$/, exact: true }).click();
    
    // Fill project details
    await page.getByRole('textbox', { name: 'Title' }).click();
    await page.getByRole('textbox', { name: 'Title' }).fill('My New Project');
    
    // Create project
    await page.getByRole('button', { name: 'Create' }).click();
    
    // Wait for API response and validate
    const projectResponse = await projectCreationPromise;
    const status = projectResponse.status();
    console.log(`📡 Project creation API responded with status: ${status}`);
    
    // Verify successful creation (201 Created or 200 OK)
    expect([200, 201]).toContain(status);
    console.log(`✅ Project creation successful with status: ${status}`);
    
    // Validate response body
    try {
        const responseBody = await projectResponse.json();
        console.log('Project creation response:', responseBody);
        
        // Verify project data in response
        if (responseBody.id || responseBody.projectId) {
            console.log(`✅ Project ID: ${responseBody.id || responseBody.projectId}`);
        }
        
        if (responseBody.title) {
            expect(responseBody.title).toBe('My New Project');
            console.log('✅ Project title matches');
        }
        
        // Check for project type/ category
        if (responseBody.type || responseBody.category) {
            console.log(`✅ Project type: ${responseBody.type || responseBody.category}`);
        }
        
        // Check timestamps
        if (responseBody.createdAt || responseBody.created_at) {
            console.log('✅ Creation timestamp present');
        }
    } catch (e) {
        console.log('Response body is not JSON or empty');
    }
    
    // Verify the new project was created
    await expect(page.getByRole('heading' , {name: 'My New Project'})).toBeVisible();
    console.log('✅ New project created successfully');
  });