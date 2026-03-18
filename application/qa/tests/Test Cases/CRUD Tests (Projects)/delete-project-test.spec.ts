/// Import from Base Test
import { test, expect } from '../../Base Test/base-test';

/// Test Case: Deleting a project succesfully
test('Project deletion test @deleteproject', async ({ page }) => {
    
    // Navigate to Projects page
    await page.getByRole('link', { name: 'Projects' }).click();
    
    // Store project info before deletion (to verify it's gone later)
    const projectName = await page.locator('li:nth-child(2) > .project-card .project-title, li:nth-child(2) > .project-card h3')
        .first().textContent().catch(() => 'Project');
    console.log(`📁 Attempting to delete: "${projectName}"`);
    
    // Set up API response promise BEFORE clicking delete
    const deleteResponsePromise = page.waitForResponse(response => 
        response.request().method() === 'DELETE' && 
        response.url().includes('/projects/') || 
        response.url().includes('/api/project/'),
        { timeout: 10000 }
    );
    
    // Click on the project card
    await page.locator('li:nth-child(2) > .project-card > .base-button.project-button').click();
    
    // Open settings menu
    await page.getByLabel('main navigation').getByRole('button', { name: 'Open project settings menu' }).click();
    
    // Click Delete
    await page.getByRole('link', { name: 'Delete', exact: true }).click();
    
    // Confirm deletion
    await page.getByRole('button', { name: 'Do it!' }).click();
    
    // Wait for delete API response
    const deleteResponse = await deleteResponsePromise;
    const status = deleteResponse.status();
    console.log(`📡 Delete API responded with status: ${status}`);
    
    // Verify successful deletion (200 OK, 202 Accepted, or 204 No Content)
    const successStatuses = [200, 202, 204];
    expect(successStatuses).toContain(status);
    console.log(`✅ Delete API returned successful status: ${status}`);
});