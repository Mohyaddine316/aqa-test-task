/// Import from Base Test
import { test, expect } from '../../Base Test/base-test';


/// Test Case: Update a project's details succsessfully
test('Update Project test @updateproject', async ({ page }) => {
  console.log('🚀 Starting test: Add task to project');
  
  // Step 1: Navigate to Projects
  console.log('📂 Navigating to Projects...');
  await page.getByRole('link', { name: 'Projects' }).click();
  console.log('✅ Projects page loaded');

  // Step 2: Find and open project
  const projectLinks = page.getByRole('link', { name: 'My New Project' });
  const count = await projectLinks.count();
  
  if (count === 0) {
    console.error('❌ No "My New Project" links found');
    throw new Error('No "My New Project" links found to update.');
  }
  
  console.log(`📁 Opening project (${count} found)...`);
  await projectLinks.first().click();
  console.log('✅ Project opened');

  // Step 3: Add task
  const taskName = 'Delete prod DB';
  console.log(`📝 Adding task: "${taskName}"`);
  
  const taskTextbox = page.getByRole('textbox', { name: 'Add a task…' });
  await taskTextbox.click();
  await taskTextbox.fill(taskName);
  
  await page.getByRole('paragraph').filter({ hasText: /^Add$/ }).click();
  console.log('✅ Task added');

  // Step 4: Verify
  await expect(page.getByRole('link', { name: 'Delete prod DB', exact: true }).first()).toBeVisible();
  console.log('✅ Task verified in UI');
  
  console.log('🎉 Test complete');
});





