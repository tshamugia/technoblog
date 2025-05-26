# Node.js + Express API Coding Standards

## Project Structure
- Use the following folder structure:

/src
    /controllers/    # Request handlers
    /routes/         # Express route definitions
    /services/       # Business logic
    /models/         # Database requests
    /middleware/     # Custom middleware
    /utils/          # Utility functions
    /config/         # Configuration files

- Entry point: `src/server.ts`
- Environment variables: Use `dotenv` with `.env` file

## General Coding Guidelines
- Language: TypeScript (ES6+)
- Use TypeScript with strict mode
- Define interfaces for request/response bodies
- Use `@types/express` for type safety
- Use async/await for asynchronous operations; avoid callbacks
- Follow RESTful API conventions
- Use meaningful variable/function names with camelCase
- Include JSDoc comments for all functions
- Handle errors with try/catch and return appropriate HTTP status codes
- Use ESLint with Airbnb style guide for linting
- Use file naming conventions:
  - Controllers: `user-controller.ts`
  - Routes: `user-routes.ts`
  - Services: `user-service.ts`
  - Models: `user-model.ts`
  - Middleware: `auth-middleware.ts`
  - Utils: `date-utils.ts`

## Express Guidelines
- Use Express Router for modular route definitions
- Organize routes by resource (e.g., `/routes/user-routes.js`, `/routes/product-routes.js`)
- Implement input validation using `express-validator`
- Return JSON responses with consistent structure:
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}

or for errors:

{
  "success": false,
  "error": "Error message",
  "code": 400
}
```