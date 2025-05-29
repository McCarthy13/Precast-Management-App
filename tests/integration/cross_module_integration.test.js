/**
 * Cross-Module Integration Tests
 * 
 * This file contains integration tests that verify the proper interaction
 * between different modules in the Precast Concrete Management System.
 */

const { test, expect } = require('@playwright/test');

test.describe('Cross-Module Integration', () => {
  let page;
  
  test.beforeEach(async ({ browser }) => {
    // Create a new page for each test
    page = await browser.newPage();
    
    // Log in as an admin user with access to all modules
    await page.goto('/api/auth/signin');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for login to complete
    await page.waitForNavigation();
  });
  
  test('Project creation to production scheduling workflow', async () => {
    // 1. Create a new project in Project Management
    await page.goto('/project-management/projects');
    await page.click('button:has-text("New Project")');
    
    // Fill project details
    await page.fill('input[name="projectName"]', 'Integration Test Project');
    await page.fill('input[name="clientName"]', 'Test Client');
    await page.fill('textarea[name="description"]', 'Project created for integration testing');
    await page.fill('input[name="startDate"]', '2023-06-01');
    await page.fill('input[name="endDate"]', '2023-12-31');
    await page.click('button:has-text("Create Project")');
    
    // Verify project creation success
    await expect(page.locator('text=Project created successfully')).toBeVisible();
    
    // Get the project ID from the URL
    const url = page.url();
    const projectId = url.split('/').pop();
    
    // 2. Navigate to Drafting/Engineering to add drawings
    await page.goto(`/drafting-engineering/projects/${projectId}`);
    await page.click('button:has-text("Upload Drawing")');
    
    // Upload a drawing file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-assets/sample-drawing.pdf');
    await page.fill('input[name="drawingNumber"]', 'DWG-001');
    await page.fill('input[name="revision"]', 'A');
    await page.click('button:has-text("Upload")');
    
    // Verify drawing upload success
    await expect(page.locator('text=Drawing uploaded successfully')).toBeVisible();
    
    // 3. Navigate to Production Scheduling
    await page.goto(`/production-scheduling/projects/${projectId}`);
    await page.click('button:has-text("Create Production Schedule")');
    
    // Fill schedule details
    await page.fill('input[name="scheduleName"]', 'Test Production Schedule');
    await page.click('button:has-text("Next")');
    
    // Add pieces to the schedule
    await page.click('button:has-text("Add Pieces")');
    await page.click('.drawing-item:has-text("DWG-001")');
    await page.click('button:has-text("Select Pieces")');
    await page.click('.piece-checkbox');
    await page.click('button:has-text("Add Selected")');
    
    // Set production dates
    await page.fill('input[name="productionDate"]', '2023-07-15');
    await page.click('button:has-text("Save Schedule")');
    
    // Verify schedule creation success
    await expect(page.locator('text=Production schedule created successfully')).toBeVisible();
    
    // 4. Navigate to Quality Control to verify pieces are scheduled for inspection
    await page.goto('/quality-control/inspection');
    
    // Search for the project
    await page.fill('input[placeholder="Search projects..."]', 'Integration Test Project');
    
    // Verify project appears in QC module
    await expect(page.locator('text=Integration Test Project')).toBeVisible();
    
    // 5. Navigate to Yard Management to verify pieces are tracked
    await page.goto('/yard-management');
    
    // Search for the project
    await page.fill('input[placeholder="Search projects..."]', 'Integration Test Project');
    
    // Verify project appears in Yard Management module
    await expect(page.locator('text=Integration Test Project')).toBeVisible();
  });
  
  test('Production to shipping to dispatch workflow', async () => {
    // Assume we have a project with pieces already in production
    
    // 1. Navigate to Production module
    await page.goto('/production');
    
    // Select a project with pieces in production
    await page.click('.project-card:has-text("Parkside Apartments")');
    
    // Mark a piece as completed
    await page.click('.piece-item:first-child');
    await page.click('button:has-text("Mark as Completed")');
    await page.click('button:has-text("Confirm")');
    
    // Verify piece status update
    await expect(page.locator('text=Piece status updated to COMPLETED')).toBeVisible();
    
    // Get the piece number
    const pieceNumber = await page.locator('.piece-item:first-child .piece-number').textContent();
    
    // 2. Navigate to Quality Control for post-pour inspection
    await page.goto('/quality-control/inspection');
    await page.click('.workspace-card:has-text("Parkside Apartments")');
    await page.click('text=Post-Pour Inspection');
    
    // Search for the piece
    await page.fill('input[placeholder="Search pieces..."]', pieceNumber);
    await page.click(`.piece-card:has-text("${pieceNumber}")`);
    
    // Perform inspection
    await page.click('#drawing-container', { position: { x: 200, y: 150 } });
    await page.click('#drawing-container', { position: { x: 300, y: 250 } });
    await page.click('button:has-text("Approve")');
    
    // Verify approval
    await expect(page.locator('text=Inspection approved')).toBeVisible();
    
    // 3. Navigate to Yard Management
    await page.goto('/yard-management');
    
    // Search for the piece
    await page.fill('input[placeholder="Search pieces..."]', pieceNumber);
    
    // Verify piece status in Yard Management
    await expect(page.locator(`.piece-item:has-text("${pieceNumber}")`)).toContainText('READY_FOR_YARD');
    
    // Assign yard location
    await page.click(`.piece-item:has-text("${pieceNumber}")`);
    await page.click('button:has-text("Assign Location")');
    await page.fill('input[name="yardLocation"]', 'A-12-B');
    await page.click('button:has-text("Save")');
    
    // Verify location assignment
    await expect(page.locator('text=Location assigned successfully')).toBeVisible();
    
    // 4. Navigate to Shipping module
    await page.goto('/shipping');
    
    // Create a new shipment
    await page.click('button:has-text("New Shipment")');
    await page.fill('input[name="shipmentName"]', 'Test Shipment');
    await page.fill('input[name="deliveryDate"]', '2023-08-15');
    await page.click('button:has-text("Next")');
    
    // Add the piece to the shipment
    await page.fill('input[placeholder="Search pieces..."]', pieceNumber);
    await page.click(`.piece-checkbox:near(:text("${pieceNumber}"))`);
    await page.click('button:has-text("Add Selected")');
    await page.click('button:has-text("Next")');
    
    // Complete shipment creation
    await page.click('button:has-text("Create Shipment")');
    
    // Verify shipment creation
    await expect(page.locator('text=Shipment created successfully')).toBeVisible();
    
    // Get the shipment ID
    const shipmentUrl = page.url();
    const shipmentId = shipmentUrl.split('/').pop();
    
    // 5. Navigate to Dispatch module
    await page.goto('/dispatch');
    
    // Verify shipment appears in Dispatch
    await page.fill('input[placeholder="Search shipments..."]', 'Test Shipment');
    await expect(page.locator('text=Test Shipment')).toBeVisible();
    
    // Create a dispatch
    await page.click('button:has-text("Create Dispatch")');
    await page.click(`.shipment-checkbox:near(:text("Test Shipment"))`);
    await page.click('button:has-text("Next")');
    
    // Assign driver and vehicle
    await page.selectOption('select[name="driver"]', { label: 'John Driver' });
    await page.selectOption('select[name="vehicle"]', { label: 'Truck 101' });
    await page.click('button:has-text("Create Dispatch")');
    
    // Verify dispatch creation
    await expect(page.locator('text=Dispatch created successfully')).toBeVisible();
  });
  
  test('AI service integration across modules', async () => {
    // 1. Test Production Scheduling AI recommendations
    await page.goto('/production-scheduling');
    await page.click('button:has-text("AI Recommendations")');
    
    // Verify AI recommendations are loaded
    await expect(page.locator('.ai-recommendation-card')).toBeVisible();
    await expect(page.locator('text=AI-Optimized Schedule')).toBeVisible();
    
    // 2. Test Quality Control AI defect detection
    await page.goto('/quality-control');
    await page.click('.workspace-card:first-child');
    await page.click('text=AI Defect Detection');
    
    // Upload an image for analysis
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-assets/sample-piece.jpg');
    await page.click('button:has-text("Analyze")');
    
    // Verify AI analysis results
    await expect(page.locator('text=Analysis Complete')).toBeVisible();
    await expect(page.locator('.defect-marker')).toBeVisible();
    
    // 3. Test Yard Management AI optimization
    await page.goto('/yard-management');
    await page.click('button:has-text("AI Yard Optimization")');
    
    // Verify AI optimization results
    await expect(page.locator('text=Yard Layout Optimization')).toBeVisible();
    await expect(page.locator('.optimization-metric')).toBeVisible();
    
    // 4. Test Dispatch AI route optimization
    await page.goto('/dispatch');
    await page.click('button:has-text("AI Route Optimization")');
    
    // Select shipments for optimization
    await page.click('.shipment-checkbox:first-child');
    await page.click('button:has-text("Optimize Routes")');
    
    // Verify optimization results
    await expect(page.locator('text=Route Optimization Complete')).toBeVisible();
    await expect(page.locator('.optimized-route-card')).toBeVisible();
    
    // 5. Test Environmental/Sustainability AI analysis
    await page.goto('/environmental');
    await page.click('button:has-text("AI Impact Analysis")');
    
    // Select date range for analysis
    await page.fill('input[name="startDate"]', '2023-01-01');
    await page.fill('input[name="endDate"]', '2023-06-30');
    await page.click('button:has-text("Analyze")');
    
    // Verify analysis results
    await expect(page.locator('text=Environmental Impact Analysis')).toBeVisible();
    await expect(page.locator('.impact-metric')).toBeVisible();
    await expect(page.locator('.recommendation-card')).toBeVisible();
  });
  
  test('Document Management integration with other modules', async () => {
    // 1. Upload a document in Document Management
    await page.goto('/document-management');
    await page.click('button:has-text("Upload Document")');
    
    // Fill document details
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-assets/sample-document.pdf');
    await page.fill('input[name="documentName"]', 'Integration Test Document');
    await page.selectOption('select[name="documentType"]', { label: 'Specification' });
    await page.click('button:has-text("Upload")');
    
    // Verify document upload
    await expect(page.locator('text=Document uploaded successfully')).toBeVisible();
    
    // Get document ID
    await page.click('text=Integration Test Document');
    const documentUrl = page.url();
    const documentId = documentUrl.split('/').pop();
    
    // 2. Link document to a project in Project Management
    await page.goto('/project-management/projects');
    await page.click('.project-card:first-child');
    await page.click('button:has-text("Link Document")');
    
    // Search for the document
    await page.fill('input[placeholder="Search documents..."]', 'Integration Test Document');
    await page.click('.document-checkbox:near(:text("Integration Test Document"))');
    await page.click('button:has-text("Link Selected")');
    
    // Verify document linking
    await expect(page.locator('text=Document linked successfully')).toBeVisible();
    
    // 3. Verify document appears in Quality Control
    await page.goto('/quality-control');
    await page.click('.workspace-card:first-child');
    await page.click('text=Documents');
    
    // Verify document is visible
    await expect(page.locator('text=Integration Test Document')).toBeVisible();
    
    // 4. Verify document appears in Production
    await page.goto('/production');
    await page.click('.project-card:first-child');
    await page.click('text=Documents');
    
    // Verify document is visible
    await expect(page.locator('text=Integration Test Document')).toBeVisible();
    
    // 5. Verify document appears in Field Services
    await page.goto('/field-services');
    await page.click('.project-card:first-child');
    await page.click('text=Documents');
    
    // Verify document is visible
    await expect(page.locator('text=Integration Test Document')).toBeVisible();
  });
  
  test('User permissions and access control across modules', async ({ browser }) => {
    // Create pages for different user roles
    const adminPage = page; // Already logged in as admin
    
    // 1. Log in as Production Manager
    const productionPage = await browser.newPage();
    await productionPage.goto('/api/auth/signin');
    await productionPage.fill('input[name="email"]', 'production@example.com');
    await productionPage.fill('input[name="password"]', 'production123');
    await productionPage.click('button[type="submit"]');
    await productionPage.waitForNavigation();
    
    // 2. Log in as QC Technician
    const qcPage = await browser.newPage();
    await qcPage.goto('/api/auth/signin');
    await qcPage.fill('input[name="email"]', 'qc@example.com');
    await qcPage.fill('input[name="password"]', 'qc123');
    await qcPage.click('button[type="submit"]');
    await qcPage.waitForNavigation();
    
    // 3. Log in as Yard Manager
    const yardPage = await browser.newPage();
    await yardPage.goto('/api/auth/signin');
    await yardPage.fill('input[name="email"]', 'yard@example.com');
    await yardPage.fill('input[name="password"]', 'yard123');
    await yardPage.click('button[type="submit"]');
    await yardPage.waitForNavigation();
    
    // Test Production Manager permissions
    await productionPage.goto('/production');
    await expect(productionPage.locator('h1:has-text("Production")')).toBeVisible();
    
    await productionPage.goto('/quality-control');
    await expect(productionPage.locator('text=View Only')).toBeVisible();
    
    await productionPage.goto('/project-management');
    await expect(productionPage.locator('text=View Only')).toBeVisible();
    
    await productionPage.goto('/safety');
    await expect(productionPage.locator('text=Access Denied')).toBeVisible();
    
    // Test QC Technician permissions
    await qcPage.goto('/quality-control');
    await expect(qcPage.locator('h1:has-text("Quality Control")')).toBeVisible();
    
    await qcPage.goto('/production');
    await expect(qcPage.locator('text=View Only')).toBeVisible();
    
    await qcPage.goto('/yard-management');
    await expect(qcPage.locator('text=Access Denied')).toBeVisible();
    
    // Test Yard Manager permissions
    await yardPage.goto('/yard-management');
    await expect(yardPage.locator('h1:has-text("Yard Management")')).toBeVisible();
    
    await yardPage.goto('/shipping');
    await expect(yardPage.locator('h1:has-text("Shipping")')).toBeVisible();
    
    await yardPage.goto('/production');
    await expect(yardPage.locator('text=View Only')).toBeVisible();
    
    await yardPage.goto('/estimating');
    await expect(yardPage.locator('text=Access Denied')).toBeVisible();
    
    // Test document access control
    // Create a confidential document as admin
    await adminPage.goto('/document-management');
    await adminPage.click('button:has-text("Upload Document")');
    
    const fileInput = adminPage.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-assets/confidential-document.pdf');
    await adminPage.fill('input[name="documentName"]', 'Confidential Document');
    await adminPage.selectOption('select[name="documentType"]', { label: 'Contract' });
    await adminPage.check('input[name="confidential"]');
    await adminPage.click('button:has-text("Upload")');
    
    // Verify document is visible to admin
    await adminPage.goto('/document-management');
    await expect(adminPage.locator('text=Confidential Document')).toBeVisible();
    
    // Verify document is not visible to production manager
    await productionPage.goto('/document-management');
    await expect(productionPage.locator('text=Confidential Document')).not.toBeVisible();
    
    // Verify document is not visible to QC technician
    await qcPage.goto('/document-management');
    await expect(qcPage.locator('text=Confidential Document')).not.toBeVisible();
    
    // Verify document is not visible to yard manager
    await yardPage.goto('/document-management');
    await expect(yardPage.locator('text=Confidential Document')).not.toBeVisible();
  });
});
