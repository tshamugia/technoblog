# TechnoBlog

A modern blogging platform with a clean architecture.

## Project Structure and Naming Conventions

This guide outlines the naming conventions and organization for different parts of the application.

### Directory Structure

```
/config      - Configuration files
/controllers - Request handlers
/middleware  - Express middleware
/models      - Data models
/routes      - API routes
/utils       - Utility functions
/public      - Static assets
/views       - Template files
```

### Naming Guidelines by Directory

#### /config

- Use simple, descriptive names (e.g., `database.js`, `config.js`)
- Avoid overly specific names unless necessary

#### /controllers

- Format: `<entity>-controller.js`
- Example: `post-controller.js`
- Names should reflect the resource they manage

#### /middleware

- Format: `<purpose>-middleware.js`
- Example: `auth-middleware.js`, `error-handler.js`
- Names should indicate the middleware's role

#### /models

- Use singular, CamelCase names
- Example: `Post.js`, `User.js`
- Match model names with database collections/tables

#### /routes

- Format: `<entity>-routes.js`
- Example: `post-routes.js`
- Use `index.js` for the main router

#### /utils

- Use simple names for general utilities (e.g., `logger.js`, `helpers.js`)
- Use descriptive names for specific utilities (e.g., `slugify.js`)

#### /public

- Use lowercase, descriptive names
- Example: `style.css`, `thumbnail.jpg`
- For images: `post-image-1.jpg` (no spaces or special characters)

#### /views

- Use lowercase, descriptive names (e.g., `index.ejs`, `post.ejs`)
- Partials: Use component names (e.g., `header.ejs`)
- Layouts: Use generic names (e.g., `main.ejs`)

### Root Files

- Follow conventional naming:
  - `app.js` - Main application file
  - `.env` - Environment variables
  - `.gitignore` - Git ignore rules
  - `package.json` - Project dependencies
  - `README.md` - Project documentation
