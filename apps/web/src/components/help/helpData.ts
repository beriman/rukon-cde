/**
 * Help Center Types and Data
 */

export interface HelpArticle {
    id: string;
    slug: string;
    title: string;
    category: string;
    content: string;
    tags: string[];
    videoUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface HelpCategory {
    id: string;
    name: string;
    icon: string;
    description: string;
}

export const HELP_CATEGORIES: HelpCategory[] = [
    { id: 'getting-started', name: 'Getting Started', icon: '🚀', description: 'Quick start guides and basics' },
    { id: 'documents', name: 'Documents', icon: '📁', description: 'File upload and management' },
    { id: 'workflows', name: 'Workflows', icon: '🔄', description: 'Approval and CDE workflows' },
    { id: '3d-viewer', name: '3D Viewer', icon: '🏗️', description: 'Model viewing and BCF issues' },
    { id: 'reports', name: 'Reports', icon: '📊', description: 'Generating project reports' },
    { id: 'hse', name: 'HSE', icon: '🦺', description: 'Health and safety features' },
];

export const HELP_ARTICLES: HelpArticle[] = [
    // Getting Started
    {
        id: '1',
        slug: 'quick-start-guide',
        title: 'Quick Start Guide',
        category: 'getting-started',
        content: `
# Quick Start Guide

Welcome to Rukon CDE! This guide will help you get up and running in minutes.

## Step 1: Complete Your Profile
1. Click your avatar in the top-right corner
2. Select "Profile Settings"
3. Add your name and contact information

## Step 2: Join or Create a Project
- If invited, accept the invitation from your email
- To create a new project, click "New Project" on the dashboard

## Step 3: Upload Your First Document
1. Navigate to the Documents tab
2. Click "Upload" and select your file
3. Fill in the metadata and submit

## Step 4: Explore the Platform
Use the Product Tour to discover key features!
    `,
        tags: ['beginner', 'setup', 'first-time'],
        videoUrl: 'https://www.youtube.com/embed/quick-start',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-15',
    },
    {
        id: '2',
        slug: 'understanding-cde',
        title: 'What is a Common Data Environment?',
        category: 'getting-started',
        content: `
# What is a Common Data Environment (CDE)?

A CDE is a single source of truth for all project information.

## Key Principles
- **Single Source**: All team members access the same data
- **Version Control**: Track changes and revisions automatically
- **Access Control**: Right information to right people at right time
- **Audit Trail**: Full history of who did what and when

## ISO 19650 Compliance
Rukon CDE follows ISO 19650 standards for:
- Information containers (status codes: WIP, S1-S4, A, B)
- Approval workflows
- Security classifications
    `,
        tags: ['concepts', 'iso-19650', 'cde'],
        createdAt: '2025-01-01',
        updatedAt: '2025-01-10',
    },
    // Documents
    {
        id: '3',
        slug: 'uploading-documents',
        title: 'How to Upload Documents',
        category: 'documents',
        content: `
# Uploading Documents

## Supported File Types
- **BIM Models**: IFC, RVT, NWD
- **Drawings**: DWG, PDF
- **Documents**: PDF, DOCX, XLSX

## Single File Upload
1. Go to Documents → Upload
2. Drag & drop or click to browse
3. Fill in title, category, and status
4. Click "Upload"

## Bulk Upload
1. Use the "Bulk Upload" option
2. Select multiple files
3. Metadata will be extracted automatically

## Best Practices
- Use consistent naming conventions
- Set the correct status (WIP, S1, etc.)
- Add relevant tags for searchability
    `,
        tags: ['upload', 'files', 'how-to'],
        videoUrl: 'https://www.youtube.com/embed/upload-docs',
        createdAt: '2025-01-02',
        updatedAt: '2025-01-12',
    },
    {
        id: '4',
        slug: 'managing-revisions',
        title: 'Managing Document Revisions',
        category: 'documents',
        content: `
# Managing Document Revisions

## Uploading a New Revision
1. Open the document details
2. Click "Upload New Revision"
3. Select the updated file
4. Add revision notes

## Viewing Revision History
- Click "History" on any document
- See all previous versions
- Download or compare versions

## Revision Naming
Revisions are automatically numbered (P01, P02... or A, B, C...)
    `,
        tags: ['revisions', 'version-control'],
        createdAt: '2025-01-03',
        updatedAt: '2025-01-14',
    },
    // Workflows
    {
        id: '5',
        slug: 'approval-workflows',
        title: 'Setting Up Approval Workflows',
        category: 'workflows',
        content: `
# Approval Workflows

## Creating a Workflow
1. Go to Settings → Workflows
2. Click "New Workflow"
3. Define approval stages (Review, Approve, Publish)
4. Assign approvers to each stage

## Document Status Codes
- **WIP**: Work in Progress
- **S1**: Suitable for Coordination
- **S2**: Suitable for Information
- **S3**: Suitable for Review
- **S4**: Suitable for Stage Approval
- **A**: Approved
- **B**: Partially Approved

## Approving Documents
1. You'll receive notifications for pending approvals
2. Review the document
3. Approve, Request Changes, or Reject
    `,
        tags: ['approval', 'workflows', 'iso-19650'],
        videoUrl: 'https://www.youtube.com/embed/approval-flow',
        createdAt: '2025-01-04',
        updatedAt: '2025-01-16',
    },
    // 3D Viewer
    {
        id: '6',
        slug: 'viewing-ifc-models',
        title: 'Viewing IFC Models in 3D',
        category: '3d-viewer',
        content: `
# 3D Model Viewer

## Opening a Model
1. Upload an IFC file
2. Click on the file to open in viewer
3. Wait for the model to load

## Navigation Controls
- **Orbit**: Left-click + drag
- **Pan**: Middle-click + drag or Shift + Left-click
- **Zoom**: Scroll wheel

## Selecting Elements
- Click to select an element
- View properties in the side panel
- Use the model tree to find elements

## Measurements
1. Click the measure tool
2. Click two points to measure distance
    `,
        tags: ['3d', 'ifc', 'viewer', 'bim'],
        videoUrl: 'https://www.youtube.com/embed/3d-viewer',
        createdAt: '2025-01-05',
        updatedAt: '2025-01-17',
    },
    {
        id: '7',
        slug: 'creating-bcf-issues',
        title: 'Creating BCF Issues',
        category: '3d-viewer',
        content: `
# BCF Issues

BCF (BIM Collaboration Format) allows you to create issues linked to 3D viewpoints.

## Creating an Issue
1. Position the view as needed
2. Click "Create Issue"
3. Fill in: Title, Priority, Assignee
4. Add description
5. Submit

## Managing Issues
- Filter by status, priority, or assignee
- Export as BCF file for other software
- Import BCF files from Revit, Navisworks, etc.
    `,
        tags: ['bcf', 'issues', 'collaboration'],
        createdAt: '2025-01-06',
        updatedAt: '2025-01-18',
    },
    // Reports
    {
        id: '8',
        slug: 'generating-reports',
        title: 'Generating Project Reports',
        category: 'reports',
        content: `
# Project Reports

## Report Types
- **Weekly Progress Report**: S-Curve, activities, photos
- **Monthly Report**: Full project status
- **HSE Report**: Incidents, safe work days

## Generating a Report
1. Go to Reports → Generate
2. Select report type
3. Choose date range
4. Select sections to include
5. Click Generate

## Customizing Reports
- Add your logo in Settings
- Select which sections to include
- Add executive summary
    `,
        tags: ['reports', 'pdf', 'export'],
        videoUrl: 'https://www.youtube.com/embed/reports',
        createdAt: '2025-01-07',
        updatedAt: '2025-01-19',
    },
    // HSE
    {
        id: '9',
        slug: 'logging-incidents',
        title: 'Logging Safety Incidents',
        category: 'hse',
        content: `
# Safety Incident Logging

## Creating an Incident Report
1. Go to HSE → New Incident
2. Select incident type (Near Miss, First Aid, etc.)
3. Enter date, time, location
4. Describe what happened
5. Attach photos if available
6. Submit

## Incident Investigation
- Assigned investigators will be notified
- Complete the investigation form
- Add corrective actions
- Close when resolved

## Dashboard
- View safe work days counter
- Track incident trends
- Download HSE reports
    `,
        tags: ['hse', 'safety', 'incidents'],
        createdAt: '2025-01-08',
        updatedAt: '2025-01-20',
    },
    {
        id: '10',
        slug: 'ai-assistant-guide',
        title: 'Using the AI Assistant',
        category: 'getting-started',
        content: `
# AI Assistant

Ask questions about your project documents and get instant answers.

## How It Works
1. Open the AI Assistant panel
2. Type your question in natural language
3. AI searches your indexed documents
4. Get answers with source citations

## Example Questions
- "What is the concrete specification for foundations?"
- "Show me all RFIs related to structural work"
- "What is the project completion date?"

## Tips
- Be specific in your questions
- AI only knows what's in your documents
- Click on sources to view the original document
    `,
        tags: ['ai', 'search', 'assistant'],
        videoUrl: 'https://www.youtube.com/embed/ai-assistant',
        createdAt: '2025-01-09',
        updatedAt: '2025-01-21',
    },
];

// Search function
export function searchArticles(query: string): HelpArticle[] {
    const lowerQuery = query.toLowerCase();
    return HELP_ARTICLES.filter(
        article =>
            article.title.toLowerCase().includes(lowerQuery) ||
            article.content.toLowerCase().includes(lowerQuery) ||
            article.tags.some(tag => tag.includes(lowerQuery))
    );
}

// Get articles by category
export function getArticlesByCategory(categoryId: string): HelpArticle[] {
    return HELP_ARTICLES.filter(article => article.category === categoryId);
}

// Get article by slug
export function getArticleBySlug(slug: string): HelpArticle | undefined {
    return HELP_ARTICLES.find(article => article.slug === slug);
}
