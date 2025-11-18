# Project Summary

## Overall Goal
Implement a CMS integration solution for Plasmic that allows embedding the web builder in an iframe, authenticating users via JWT tokens based on user ID, listing projects in a workspace-specific manner in an HTML app, and opening specific projects in the builder when clicked, with both HTML and React implementations.

## Key Knowledge
- **Technology Stack**: Plasmic uses a multi-service architecture with frontend (port 3003), backend (port 3004), and host server (port 3005)
- **Database**: PostgreSQL with a database named 'wab' and user 'wab'; requires Node.js v21.5.0 to avoid compatibility issues with buffer libraries
- **Authentication**: JWT-based authentication with API key protection for CMS integration; requires both `user_id` and `tenant_id` in token generation API
- **URL Format**: Use `http://localhost:3003/workspaces/{workspaceId}?token={jwtToken}#tab=projects` for workspace-specific project lists
- **Project Structure**: Monorepo with multiple packages including canvas-packages, host, live-frame, react-web-bundle, sub, wab (main application)
- **Build Tools**: Uses Yarn for dependency management, rsbuild for frontend bundling
- **Credentials**: Default admin credentials are email: admin@admin.example.com, password: !53kr3tz!
- **Migration Management**: Uses TypeORM with migrations stored in `src/wab/server/migrations/`
- **API Endpoints**: `/api/v1/cms-integration/generate-token` for JWT token generation, `/api/v1/user/projects` for user project listing

## Recent Actions
- [DONE] Set up PostgreSQL database with correct user and database
- [DONE] Run database migrations and recreate missing tables after accidental deletion
- [DONE] Install all dependencies using Yarn and build dependencies
- [DONE] Start all development services (frontend, backend, host) on ports 3003, 3004, and 3005 respectively
- [DONE] Create admin user with credentials from ADMIN-CREDENTIALS.md and seed database with test data
- [DONE] Implement CMS integration API endpoints for generating JWT tokens and user projects with proper field names (`user_id`, `tenant_id`)
- [DONE] Create HTML demo file `cms-integration-demo.html` with project listing, builder embedding, and project creation functionality
- [DONE] Convert HTML demo to React component with equivalent functionality (`CmsIntegrationDemo.jsx`)
- [DONE] Add project creation, viewing, and management features to both HTML and React implementations
- [DONE] Update API calls to use correct field names (`user_id` and `tenant_id` instead of `userId`)
- [DONE] Add CSRF bypass for CMS integration endpoints and verify all services are properly connected
- [DONE] Successfully updated React Component to use workspace-specific project URLs (`http://localhost:3003/workspaces/{workspaceId}?token={token}#tab=projects`)
- [DONE] Updated HTML file to include workspace ID input field and API call with workspace_id parameter

## Current Plan
1. [DONE] Set up PostgreSQL database with correct user and database
2. [DONE] Run database migrations
3. [DONE] Install all dependencies using Yarn
4. [DONE] Build dependencies using setup script
5. [DONE] Generate parser files
6. [DONE] Start all development services (frontend, backend, host)
7. [DONE] Verify services are responsive and properly connected
8. [DONE] Create users with credentials from ADMIN-CREDENTIALS.md
9. [DONE] Populate database with test data using seed script
10. [DONE] Verify CSRF endpoint functionality for authentication
11. [DONE] Confirm all services are working together properly
12. [DONE] Implement CMS integration API for JWT token generation with proper field names
13. [DONE] Create user projects API to list projects for authenticated users
14. [DONE] Create HTML integration demo to list and open projects
15. [DONE] Test project opening functionality in embedded builder
16. [DONE] Fix project URL format to properly open specific projects
17. [DONE] Remove problematic UI elements that interfere with builder loading
18. [DONE] Ensure proper fallback functionality for demo projects
19. [DONE] Close development server and clean up memory
20. [DONE] Complete the project and provide comprehensive documentation
21. [DONE] Run the project successfully with all services operational
22. [DONE] Convert HTML implementation to React component
23. [DONE] Add project creation functionality to both implementations
24. [DONE] Update API request parameters to include required `tenant_id` field
25. [IN PROGRESS] Update the HTML file's `loadProjectsList` function to use workspace-specific URLs
26. [TODO] Update all project action functions in the HTML file to use workspace-specific URLs
27. [TODO] Test the workspace-specific functionality in both implementations
28. [TODO] Document the workspace filtering feature

---

## Summary Metadata
**Update time**: 2025-11-17T19:07:55.730Z 
