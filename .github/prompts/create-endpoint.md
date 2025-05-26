## Goal
Generate a new RESTful API endpoint for a Node.js + Express application, following the project's coding standards defined in `.github/copilot-instructions.md`.

## Instructions
1. Ask for the following if not provided:
   - Resource name (e.g., "user", "product")
   - HTTP method (GET, POST, PUT, DELETE)
   - Route path (e.g., "/api/users")
   - Whether authentication is required
2. Generate the following files:
   - **Controller**: In `src/controllers/<resource>-controller.ts`
   - **Route**: In `src/routes/<resource>-routes.ts`
   - **Service**: In `src/services/<resource>-service.ts`
   - **Model**: In `src/models/<resource>-model.ts`
3. Include:
   - Input validation with `express-validator`
   - Async/await with `asyncHandler`
   - JSDoc comments
   - Consistent JSON response structure
   - Error handling with custom `ApiError`
4. Follow the folder structure and standards from `.github/copilot-instructions.md`.