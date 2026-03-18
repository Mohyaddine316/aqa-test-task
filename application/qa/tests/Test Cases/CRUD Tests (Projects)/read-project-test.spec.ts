/// Import from Base Test
import { test, expect } from '../../Base Test/base-test';
 
/// Test Case: Verify being able to access project and open tasks and read contents
test('Read Project tasks/details test @readproject', async ({ page }) => {
    console.log('🚀 Starting test: Read project tasks');

    // Navigate to Projects
    console.log('📂 Navigating to Projects...');
    await page.getByRole('link', { name: 'Projects' }).click();
    console.log('✅ Projects page loaded');

    // Find and open project
    const projectLinks = page.getByRole('link', { name: 'My New Project' });
    const count = await projectLinks.count();
    console.log(`📁 Found ${count} project(s)`);
    
    if (count === 0) {
        console.error('❌ No project found');
        throw new Error('Project "My New Project" not found');
    }
    
    // Click on project
    console.log('📂 Opening project...');
    await projectLinks.first().click();
    console.log('✅ Project opened');

    // Click on Task
    console.log('📂 Opening task...')
    await (page.getByRole('link', { name: 'Delete prod DB', exact: true }).first()).click();
    
    // Assert Task existing
    await expect(page.getByText('Delete prod DB')).toBeVisible;
    console.log('✅ Task found');
});
