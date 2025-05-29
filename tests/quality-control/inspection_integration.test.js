/**
 * Integration Test for QC Inspection Feature
 * 
 * This file contains end-to-end tests for the Quality Control inspection feature,
 * focusing on cross-module integration and data flow.
 */

// Import required modules
const { test, expect } = require('@playwright/test');

test.describe('QC Inspection Workflow Integration', () => {
  let page;
  
  test.beforeEach(async ({ browser }) => {
    // Create a new page for each test
    page = await browser.newPage();
    
    // Log in as a QC technician
    await page.goto('/api/auth/signin');
    await page.fill('input[name="email"]', 'qc_tech@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for login to complete
    await page.waitForNavigation();
  });
  
  test('Complete pre-pour inspection and verify cross-module updates', async () => {
    // Navigate to the QC dashboard
    await page.goto('/quality-control');
    
    // Find and click on a workspace/form that has pieces scheduled for inspection
    await page.click('text=Workspace A / Form 1');
    
    // Click on Pre-Pour Inspection
    await page.click('text=Pre-Pour Inspection');
    
    // Verify the inspection page loads with pieces
    await expect(page.locator('text=Arrange Pieces for Inspection')).toBeVisible();
    
    // Rearrange pieces (drag the second piece to the first position)
    const secondPiece = page.locator('.draggable-piece').nth(1);
    const firstPosition = page.locator('.piece-drop-area').first();
    await secondPiece.dragTo(firstPosition);
    
    // Verify the arrangement is saved
    await expect(page.locator('text=Piece arrangement saved')).toBeVisible();
    
    // Navigate to the first piece
    await page.click('.piece-card').first();
    
    // Add inspection points by clicking on the drawing
    await page.click('#drawing-container', { position: { x: 200, y: 150 } });
    await page.click('#drawing-container', { position: { x: 300, y: 250 } });
    
    // Verify inspection points are added
    await expect(page.locator('.inspection-point')).toHaveCount(2);
    
    // Approve the piece
    await page.click('button:has-text("Approve")');
    
    // Verify approval toast appears
    await expect(page.locator('text=Inspection approved')).toBeVisible();
    
    // Verify piece status is updated
    await expect(page.locator('.piece-status:has-text("READY_FOR_POUR")')).toBeVisible();
    
    // Navigate to Yard Management to verify cross-module integration
    await page.goto('/yard');
    
    // Search for the inspected piece
    const pieceNumber = await page.locator('.piece-card').first().getAttribute('data-piece-number');
    await page.fill('input[placeholder="Search pieces..."]', pieceNumber);
    
    // Verify the piece status is updated in Yard Management
    await expect(page.locator(`.piece-item:has-text("${pieceNumber}")`)).toContainText('READY_FOR_POUR');
    
    // Navigate to Production to verify cross-module integration
    await page.goto('/production');
    
    // Search for the inspected piece
    await page.fill('input[placeholder="Search pieces..."]', pieceNumber);
    
    // Verify the piece is eligible for pour in Production
    await expect(page.locator(`.production-item:has-text("${pieceNumber}")`)).toContainText('Eligible for Pour');
    
    // Navigate to Shipping to verify cross-module integration
    await page.goto('/shipping');
    
    // Search for the inspected piece
    await page.fill('input[placeholder="Search pieces..."]', pieceNumber);
    
    // Verify the piece is NOT eligible for shipping yet (needs post-pour inspection)
    await expect(page.locator(`.shipping-item:has-text("${pieceNumber}")`)).toContainText('Not Eligible for Shipping');
  });
  
  test('Complete post-pour inspection and verify shipping eligibility', async () => {
    // Navigate to the QC dashboard
    await page.goto('/quality-control');
    
    // Find and click on a workspace/form that has pieces with completed pre-pour inspection
    await page.click('text=Workspace A / Form 1');
    
    // Click on Post-Pour Inspection
    await page.click('text=Post-Pour Inspection');
    
    // Verify the inspection page loads with pieces
    await expect(page.locator('text=Arrange Pieces for Inspection')).toBeVisible();
    
    // Navigate to the first piece
    await page.click('.piece-card').first();
    
    // Add inspection points by clicking on the drawing
    await page.click('#drawing-container', { position: { x: 200, y: 150 } });
    await page.click('#drawing-container', { position: { x: 300, y: 250 } });
    
    // Verify inspection points are added
    await expect(page.locator('.inspection-point')).toHaveCount(2);
    
    // Approve the piece
    await page.click('button:has-text("Approve")');
    
    // Verify approval toast appears
    await expect(page.locator('text=Inspection approved')).toBeVisible();
    
    // Verify piece status is updated
    await expect(page.locator('.piece-status:has-text("READY_FOR_YARD")')).toBeVisible();
    
    // Navigate to Yard Management to verify cross-module integration
    await page.goto('/yard');
    
    // Search for the inspected piece
    const pieceNumber = await page.locator('.piece-card').first().getAttribute('data-piece-number');
    await page.fill('input[placeholder="Search pieces..."]', pieceNumber);
    
    // Verify the piece status is updated in Yard Management
    await expect(page.locator(`.piece-item:has-text("${pieceNumber}")`)).toContainText('READY_FOR_YARD');
    
    // Navigate to Shipping to verify cross-module integration
    await page.goto('/shipping');
    
    // Search for the inspected piece
    await page.fill('input[placeholder="Search pieces..."]', pieceNumber);
    
    // Verify the piece is NOW eligible for shipping
    await expect(page.locator(`.shipping-item:has-text("${pieceNumber}")`)).toContainText('Eligible for Shipping');
  });
  
  test('Mobile responsiveness of inspection interface', async ({ browser }) => {
    // Create a mobile viewport
    const mobilePage = await browser.newPage({
      viewport: { width: 375, height: 667 }
    });
    
    // Log in as a QC technician
    await mobilePage.goto('/api/auth/signin');
    await mobilePage.fill('input[name="email"]', 'qc_tech@example.com');
    await mobilePage.fill('input[name="password"]', 'password123');
    await mobilePage.click('button[type="submit"]');
    
    // Wait for login to complete
    await mobilePage.waitForNavigation();
    
    // Navigate to the QC dashboard
    await mobilePage.goto('/quality-control');
    
    // Find and click on a workspace/form
    await mobilePage.click('text=Workspace A / Form 1');
    
    // Click on Pre-Pour Inspection
    await mobilePage.click('text=Pre-Pour Inspection');
    
    // Verify the inspection page loads with pieces
    await expect(mobilePage.locator('text=Arrange Pieces for Inspection')).toBeVisible();
    
    // Test horizontal swipe navigation between pieces
    const drawingContainer = mobilePage.locator('#drawing-container');
    await drawingContainer.evaluate(element => {
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        touches: [{ clientX: 300, clientY: 200 }]
      });
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        touches: [{ clientX: 100, clientY: 200 }]
      });
      const touchEndEvent = new TouchEvent('touchend', {
        bubbles: true,
        touches: []
      });
      
      element.dispatchEvent(touchStartEvent);
      element.dispatchEvent(touchMoveEvent);
      element.dispatchEvent(touchEndEvent);
    });
    
    // Verify navigation to next piece
    await expect(mobilePage.locator('.piece-indicator')).toContainText('Piece 2 of');
    
    // Test vertical swipe navigation between pages
    await drawingContainer.evaluate(element => {
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        touches: [{ clientX: 200, clientY: 300 }]
      });
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        touches: [{ clientX: 200, clientY: 100 }]
      });
      const touchEndEvent = new TouchEvent('touchend', {
        bubbles: true,
        touches: []
      });
      
      element.dispatchEvent(touchStartEvent);
      element.dispatchEvent(touchMoveEvent);
      element.dispatchEvent(touchEndEvent);
    });
    
    // Verify navigation to next page
    await expect(mobilePage.locator('.page-indicator')).toContainText('Page 2 of');
  });
});
